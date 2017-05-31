import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import {MenuController} from "ionic-angular";
import {Facebook, FacebookLoginResponse} from "@ionic-native/facebook";
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

  constructor(public menuCtrl: MenuController, public fb: Facebook) {
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('user');
  }

  login() {
    this.fb.login(['public_profile', 'user_friends', 'email'])
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
            this.writeUserInDB(user, res)
          })
          .catch((error) => {
            console.log("facebook api error");
            console.log(error);
          })
      }
    });
  }

  logout() {
    this.fb.logout()
      .then(response => {
        alert(JSON.stringify(response));
      })
  }

  writeUserInDB(user, facebookRes) {
    console.log("in writeUserInDB");
    let dataObject = {
      name: facebookRes.name,
      gender: facebookRes.gender,
      minAge: facebookRes.age_range.min,
      picture: facebookRes.picture.data.url
    };
    this.userProfile.child(user.uid).once('value', (snapshot) => {
      if(snapshot.val() !== null){
        this.userProfile.child(user.uid).set(dataObject);
      } else {
        this.userProfile.child(user.uid).update(dataObject);
      }
    });

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

  logoutUser(): any {
    this.menuCtrl.close('mainMenu');
    console.log("nach menu close");
    return this.fireAuth.signOut();
  }

}
