import { Component } from '@angular/core';
import {IonicPage, NavController, Platform} from 'ionic-angular';
import {Facebook, FacebookLoginResponse} from "@ionic-native/facebook";
import firebase from 'firebase';
import {AuthData} from "../../providers/auth-data";
import {ViewActivityPage} from "../view-activity/view-activity";

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
  userProfile = firebase.database().ref('user');

  constructor(public navCtrl: NavController, public platform: Platform, public fb: Facebook, public authData: AuthData) {
  }


  login() {
    if(this.platform.is('android') || this.platform.is('ios')){
      this.authData.nativeFacebookLogin();
    }
    else {
      this.authData.browserFacebookLogin()
    }
  }



}
