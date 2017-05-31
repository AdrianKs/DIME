import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Facebook, FacebookLoginResponse} from "@ionic-native/facebook";
import firebase from 'firebase';
import {AuthData} from "../../providers/auth-data";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook, public authData: AuthData) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  login() {
    this.authData.login();
  }

}
