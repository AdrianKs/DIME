import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import {MenuController, Platform} from "ionic-angular";
import {Facebook, FacebookLoginResponse} from "@ionic-native/facebook";
import {ViewActivityPage} from "../pages/view-activity/view-activity";
/*
  Generated class for the AuthData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthData {

  public fireAuth: any;
  fbAccessToken: any;
  public userProfile = firebase.database().ref('user');
  firebaseCallback: any;

  constructor(public menuCtrl: MenuController, public fb: Facebook, public platform: Platform) {
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('user');
  }

  firebaseLogin() {
    console.log("in firebase login");
    let provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithRedirect(provider)
      .then(() => {
      console.log("in sign in");
      return firebase.auth().getRedirectResult()
    })
      .then((result) => {
        console.log("in get result");
        // This gives you a Google Access Token.
        // You can use it to access the Google API.
        var token = result.credential.accessToken;
        console.log("hier sollte das result kommen");
        console.log(result);
        this.userProfile.push(result);
        this.firebaseCallback = result;
        alert(JSON.stringify(result));
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch(function(error) {
      // Handle Errors here.
      var errorMessage = error.message;
    });
  }

  browserFacebookLogin() {
    let provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
      console.log(result);
      this.writeBrowserLoginDataToDB(result);
    }).catch(function(error) {
      console.log(error);
    });
  }

  nativeFacebookLogin() {
    this.fb.login(['public_profile', 'user_friends', 'email', 'user_birthday'])
      .then((res: FacebookLoginResponse) => {
        let credential;
        let user;
        console.log('Logged into Facebook!', res);
        this.fbAccessToken = res.authResponse.accessToken;
        console.log(this.fbAccessToken);
        credential = firebase.auth.FacebookAuthProvider.credential(
          res.authResponse.accessToken
        );
        firebase.auth().signInWithCredential(credential)
          .then((returnMessage) => {
            user = firebase.auth().currentUser;
            console.log("hier sollte die fb return message kommen");
            console.log(returnMessage);
            this.getdetails(user);
          })
          .catch((error) => {
            console.log("hier kommt der firebase error");
            console.log(error);
          })
      })
      .catch(e => console.log('Error logging into Facebook', e))

    //this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
  }

  getdetails(user:any) {
    console.log("in get details");
    this.fb.getLoginStatus().then((response) => {
      if(response.status == 'connected'){
        this.fb.api('/' + response.authResponse.userID + '?fields=id,name,gender,age_range,birthday,picture', [])
          .then((res) => {
            //alert(JSON.stringify(res));
            console.log(res);
            console.log(JSON.stringify(res));
            console.log("solltejetzt in DB schreiben");
            this.writeFacebookUserInDB(user, res)
          })
          .catch((error) => {
            console.log("facebook api error");
            console.log(error);
          })
      }
    });
  }

  writeFacebookUserInDB(user, facebookRes) {
    console.log("in writeFacebookUserInDB");
    let dataObject = {
      name: facebookRes.name,
      gender: facebookRes.gender,
      minAge: facebookRes.age_range.min,
      picURL: facebookRes.picture.data.url,
      birthday: facebookRes.birthday
    };
    this.userProfile.child(user.uid).once('value', (snapshot) => {
      if(snapshot.val() !== null){
        this.userProfile.child(user.uid).set(dataObject);
      } else {
        this.userProfile.child(user.uid).update(dataObject);
      }
    });
  }

  writeBrowserLoginDataToDB(userData: any){
    //ToDo: Bisher kommt noch eine Fehlermeldung bei der Beantragung weiterer Rechte.
    //      Hier muss ein Weg gefunden werden, um das Profilbild und Geburtsdatum zu laden.
    console.log("in write to DB");
    let profileInfo = userData.additionalUserInfo.profile;
    //let profilePicture = userData.additionalUserInfo.profile.picture.data;
    console.log("hier sollte das Profilbild kommen");
    console.log(profileInfo.picture);

    this.userProfile.child(userData.user.uid).set({
      name: profileInfo.name,
      gender: profileInfo.gender,
      minAge: profileInfo.age_range.min,
      picURL: profileInfo.picture.data.url,
      birthday: 0
    });
  }


  logout() {
    this.fireAuth.signOut();
    if(this.platform.is('android') || this.platform.is('ios')){
      this.fb.getLoginStatus().then((response) => {
        if(response.status == 'connected'){
          this.fb.logout()
            .then(response => {
              console.log(JSON.stringify(response));
              this.menuCtrl.close('mainMenu');
              console.log("nach menu close");
              return this.fireAuth.signOut();
            })
        }
      })
    }
  }

  deleteUser(password: string): any{
    let that = this;
    let credentials = firebase.auth.EmailAuthProvider.credential(
      this.fireAuth.currentUser.email,
      password
    );

    return this.fireAuth.currentUser.reauthenticate(credentials).then(function() {
      that.fireAuth.currentUser.delete().then(function() {
        // User deleted.
      }, function(error) {
        alert(error.message);
      });
    });
  }

}
