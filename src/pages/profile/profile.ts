import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Utilities} from "../../app/utilities";

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: Utilities) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  calculateRating() {
    let userData = this.utilities.userData;
    if(userData.ratingNeg == 0 && userData.ratingPos == 0){
      return "n.a.";
    }
    else if(userData.ratingNeg == 0){
      return "100%";
    }
    else {
      return userData.ratingPos/userData.ratingNeg + "%";
    }

  }

  openFacebookProfile(){
    window.open(this.utilities.userData.profileURL, "_system");
    //const browser = this.iab.create(this.utilities.userData.profileURL);
    //browser.show();

  }

}
