import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import {MenuController, Platform} from "ionic-angular";
import {Facebook, FacebookLoginResponse} from "@ionic-native/facebook";
import {Utilities} from "../app/utilities";
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

  constructor(public menuCtrl: MenuController, public fb: Facebook, public platform: Platform, public utilities: Utilities) {
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
      //this.writeBrowserLoginDataToDB(result);
      this.writeFacebookUserInDB(result.user, result.additionalUserInfo.profile);
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
            //console.log(returnMessage);
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
        this.fb.api('/' + response.authResponse.userID + '?fields=id,name,gender,age_range,birthday,link,picture.height(320),friends', [])
          .then((res) => {
            console.log(res);
            this.writeFacebookUserInDB(user, res)
          })
          .catch((error) => {
            console.log("facebook api error");
            console.log(error);
          });
      }
    });
  }

  writeFacebookUserInDB(user, facebookRes) {
    let facebookFriends = {};
    let object = {};
    for (let i = 0, len = facebookRes.friends.data.length; i < len; i++) {
      object[facebookRes.friends.data[i].id] = true;
      Object.assign(facebookFriends, object);
      console.log("facebookfirends: " + facebookFriends);
      console.log(facebookFriends);
      console.log(object);
    }
    let dataObject = {
      name: facebookRes.name,
      gender: facebookRes.gender,
      minAge: facebookRes.age_range.min,
      picURL: facebookRes.picture.data.url,
      birthday: 0,
      profileURL: facebookRes.link,
      ratingPos: 0,
      ratingNeg: 0,
      facebookId: facebookRes.id,
      facebookFriends: facebookFriends
    };
    let updateObject = {
      minAge: dataObject.minAge,
      picURL: dataObject.picURL,
      profileURL: dataObject.profileURL,
      facebookFriends: facebookFriends
    };
    //Object.assign(updateObject, facebookFriends);
    //Object.assign(dataObject, facebookFriends);
    if(facebookRes.birthday){
      console.log("es gibt birthday");
      dataObject.birthday = facebookRes.birthday;
      updateObject = Object.assign (updateObject, {birthday: facebookRes.birthday});
    }
    this.userProfile.child(user.uid).once('value', (snapshot) => {
      if(snapshot.val() == null){
        this.userProfile.child(user.uid).set(dataObject);
        this.utilities.setLocalUserData(dataObject);
      } else {
        this.userProfile.child(user.uid).update(updateObject);
        this.utilities.setLocalUserData(Object.assign(snapshot.val(), updateObject));
      }
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
