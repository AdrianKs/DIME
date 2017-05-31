import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Facebook, FacebookLoginResponse} from "@ionic-native/facebook";
import firebase from 'firebase';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  fbAccessToken: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  login() {
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res: FacebookLoginResponse) => {
        let credential;
        let user;
        console.log('Logged into Facebook!', res)
        this.fbAccessToken = res.authResponse.accessToken;
        console.log(this.fbAccessToken);
        credential = firebase.auth.FacebookAuthProvider.credential(
          res.authResponse.accessToken
        );
        firebase.auth().signInWithCredential(credential)
          .then((returnMessage) => {
            user = firebase.auth().currentUser;
            console.log(returnMessage);
          })
          .catch((error) => {
            console.log(error);
          })
      })
      .catch(e => console.log('Error logging into Facebook', e))

    //this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
  }

  getdetails() {
    /*facebookConnectPlugin.getLoginStatus((response) => {
      if(response.status == "connected") {
        facebookConnectPlugin.api('/' + response.authResponse.userID + '?fields=id,name,gender',[],
          function onSuccess(result) {
            alert(JSON.stringify(result));
          },
          function onError(error) {
            alert(error);
          }
        );
      }
      else {
        alert('Not logged in');
      }
    })*/
  }

  logout() {
    this.fb.logout()
      .then(response => {
        alert(JSON.stringify(response));
      })
  }

}
