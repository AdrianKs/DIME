import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook, public authData: AuthData) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
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
    this.navCtrl.setRoot(ViewActivityPage);
  }

  firebaseLogin() {
    this.authData.firebaseLogin();
  }

}
