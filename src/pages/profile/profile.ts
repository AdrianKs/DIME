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
  private user: any;
  private userId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: Utilities) {
    if(!navParams.get('user')){
      this.user=this.utilities.userData;
      this.userId = this.utilities.user.uid;
      console.log("kein parameter übergeben");
    } else {
      this.user = navParams.get('user');
      this.userId = navParams.get('userId');
      console.log("parameter übergeben");
      console.log(this.user);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
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
    console.log(this.user);
    if(this.checkIfAllowedToRate()){
      this.utilities.increaseIntInDB('user/' + this.userId + '/ratingPos');
      this.user.ratingPos = this.user.ratingPos + 1;
    }
  }

  downvote(){
    console.log(this.user);
    if(this.checkIfAllowedToRate()){
      this.utilities.increaseIntInDB('user/' + this.userId + '/ratingNeg');
      this.user.ratingNeg = this.user.ratingNeg + 1;
    }
  }

  checkIfAllowedToRate(){
    if(this.utilities.user.uid == this.userId){
      alert("Sie dürfen sich nicht selbst bewerten");
      return false;
    }
    return true;
  }

}
