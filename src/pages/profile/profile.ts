import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Utilities} from "../../app/utilities";
import {LoginPage} from "../login/login";

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
  private user: any;
  private userId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: Utilities) {
    if (!this.utilities.user.uid || this.utilities.user == {}) {
      this.navCtrl.setRoot(LoginPage);
    } else {
      if(!navParams.get('user')){
        this.user=this.utilities.userData;
        this.userId = this.utilities.user.uid;
      } else {
        this.user = navParams.get('user');
        this.userId = navParams.get('userId');
      }
    }

  }


  calculateRating() {
    if(this.user.ratingNeg == 0 && this.user.ratingPos == 0){
      return "n.a.";
    }
    else if(this.user.ratingNeg == 0){
      return "100%";
    }
    else {
      return Math.round(100*this.user.ratingPos/(this.user.ratingNeg + this.user.ratingPos) * 2)/2 + "%";
    }

  }

  openFacebookProfile(){
    window.open(this.user.profileURL, "_system");
    //const browser = this.iab.create(this.utilities.userData.profileURL);
    //browser.show();
  }

  upvote(){
    this.checkIfAllowedToRate()
      .then(allowed => {
        if(allowed){
          this.utilities.increaseIntInDB('user/' + this.userId + '/ratingPos');
          this.utilities.storeRating(this.userId, 1);
          this.user.ratingPos = this.user.ratingPos + 1;
        } else {
          alert("Sie dürfen diesen Nutzer nicht bewerten");
        }
      });
  }

  downvote(){
    this.checkIfAllowedToRate()
      .then(allowed => {
        if(allowed){
          this.utilities.increaseIntInDB('user/' + this.userId + '/ratingNeg');
          this.utilities.storeRating(this.userId, -1);
          this.user.ratingNeg = this.user.ratingNeg + 1;
        } else {
          alert("Sie dürfen diesen Nutzer nicht bewerten");
        }
      });
  }

  checkIfAllowedToRate(){
    if(this.utilities.user.uid == this.userId){
      return new Promise((resolve) => {
        resolve(false);
      });
    } else {
      return this.utilities.checkAllowedToRate(this.userId)
        .then(allowed => {
          if(allowed){
            return this.utilities.checkIfNotYetRated(this.userId);
          } else {
            return false;
          }
        })
        .then(allowed => {
          return allowed;
        })
    }
  }

}
