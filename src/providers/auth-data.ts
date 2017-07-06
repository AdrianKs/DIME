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
    let provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithRedirect(provider)
      .then(() => {
      return firebase.auth().getRedirectResult()
    })
      .then((result) => {
        // This gives you a Google Access Token.
        // You can use it to access the Google API.
        var token = result.credential.accessToken;
        console.log("firebase result", result);
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
      console.log("firebase result", result);
      //this.writeBrowserLoginDataToDB(result);
      this.writeInDBWithPlatformCheck(result.user, result.additionalUserInfo.profile);
      this.menuCtrl.enable(true, 'mainMenu');
    }).catch(function(error) {
      console.log("Login Error", error);
    });
  }

  nativeFacebookLogin() {
    this.fb.login(['public_profile', 'user_friends', 'email', 'user_birthday'])
      .then((res: FacebookLoginResponse) => {
        let credential;
        let user;
        console.log('Logged into Facebook!', res);
        this.fbAccessToken = res.authResponse.accessToken;
        credential = firebase.auth.FacebookAuthProvider.credential(
          res.authResponse.accessToken
        );
        firebase.auth().signInWithCredential(credential)
          .then((returnMessage) => {
            user = firebase.auth().currentUser;
            this.getdetails(user);
            this.menuCtrl.enable(true, 'mainMenu');
          })
          .catch((error) => {
            console.log("firebase error: ", error);
          })
      })
      .catch(e => console.log('Error logging into Facebook', e))

    //this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
  }

  getdetails(user:any) {
    this.fb.getLoginStatus().then((response) => {
      if(response.status == 'connected'){
        this.fb.api('/' + response.authResponse.userID + '?fields=id,name,gender,age_range,birthday,link,picture.height(320),friends', [])
          .then((res) => {
            this.writeInDBWithPlatformCheck(user, res)
          })
          .catch((error) => {
            console.log("facebook api error", error);
          });
      }
    });
  }

  writeInDBWithPlatformCheck(user, facebookRes){
    if(!(this.utilities.platform === "dom")){
      window["plugins"].OneSignal.getIds(ids => {
        this.writeFacebookUserInDB(user, facebookRes, ids.userId);
      })
    }
    else {
      this.writeFacebookUserInDB(user, facebookRes, '');
    }
  }

  writeFacebookUserInDB(user, facebookRes, pushID) {
    let facebookFriends = {};
    let object = {};
    for (let i = 0, len = facebookRes.friends.data.length; i < len; i++) {
      object[facebookRes.friends.data[i].id] = true;
      Object.assign(facebookFriends, object);
    }
    let dataObject = {
      name: facebookRes.name,
      gender: facebookRes.gender,
      minAge: facebookRes.age_range.min,
      picURL: facebookRes.picture.data.url,
      birthday: 0,
      profileURL: facebookRes.link,
      range: 5,
      ratingPos: 0,
      ratingNeg: 0,
      facebookId: facebookRes.id,
      facebookFriends: facebookFriends
    };
    let updateObject = {
      minAge: dataObject.minAge,
      picURL: dataObject.picURL,
      profileURL: dataObject.profileURL,
    };
    if(facebookRes.birthday){
      dataObject.birthday = facebookRes.birthday;
      updateObject = Object.assign (updateObject, {birthday: facebookRes.birthday});
    }
    if(facebookRes.friends){
      Object.assign(updateObject, {facebookFriends: facebookFriends});
    }
    this.userProfile.child(user.uid).once('value', (snapshot) => {
      if(snapshot.val() == null){
        this.userProfile.child(user.uid).set(dataObject)
          .then(() => {
            if(!(pushID === '')){
              firebase.database().ref('user/' + user.uid + '/pushid/' + pushID).set(
                true
              );
            }
          });
        this.utilities.setLocalUserData(dataObject);
      } else {
        this.userProfile.child(user.uid).update(updateObject)
          .then(() => {
            if(!(pushID === '')){
              firebase.database().ref('user/' + user.uid + '/pushid/' + pushID).set(
                true
              );
            }
          });
        this.utilities.setLocalUserData(Object.assign({}, snapshot.val(), updateObject));
      }
    });

    //write index facebookId to userId
    firebase.database().ref('facebookIdToUserId/' + facebookRes.id).set(user.uid);
  }


  logout() {
    if(this.platform.is('android') || this.platform.is('ios')){
      //Delete pushID and logout from firebase
      window["plugins"].OneSignal.getIds(ids => {
        firebase.database().ref('user/' + this.utilities.user.uid + '/pushid').child(ids.userId).remove().then(() => {
          return this.fireAuth.signOut();
        })
      });

      //Logout from Facebook
      this.fb.getLoginStatus().then((response) => {
        if(response.status == 'connected'){
          this.fb.logout()
            .then(response => {
              return this.fireAuth.signOut();
            })
        }
      })
    } else {
      this.fireAuth.signOut();
    }
    this.menuCtrl.close('mainMenu');
    this.menuCtrl.enable(false, 'mainMenu');
    this.utilities.userData = {};
    this.utilities.user = {};
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
