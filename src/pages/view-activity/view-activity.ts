import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { CreateActivityPage } from '../create-activity/create-activity'
import { Utilities } from '../../app/utilities';
import { ActivityDetailsPage } from '../activity-details/activity-details';
import { Geofence } from '@ionic-native/geofence';
import * as _ from 'lodash';
import firebase from 'firebase';
/**
 * Generated class for the ViewActivityPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-view-activity',
  templateUrl: 'view-activity.html',
  providers: [DataProvider]
})
export class ViewActivityPage {

  ionViewWillEnter() {
    //this.loggedInUserID = this.utilities.user.uid;
    //console.log("userID: " + this.loggedInUserID);
    //this.userCategories = {0:true, 1:true, 2:true, 3:true, 4:true, 5:true, 6:true, 7:true};
    //this.userCategories = this.utilities.userCategories;
    this.loadData(true, null);
  }

  activityOwner: String = "other";
  today: String = new Date().toISOString();
  counterOther: any;
  loggedInUserID: any;
  userCategories: any;
  userRange: any;
  facebookFriends: any;
  dataActivity: any;
  dataCategory: any;
  dataUser: any;
  dataCategorySubs: any;
  dataFacebookId: any;
  friendActivityExists: boolean = false;
  loading: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private dataProvider: DataProvider,
    private utilities: Utilities,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public geofence: Geofence) {
  }

  loadData(showLoading: boolean, event): void {
    if (showLoading) {
      this.createAndShowLoading();
    }
    this.dataProvider.setCategory().then((data) => {
      this.dataCategory = this.dataProvider.dataCategory;
      if (showLoading) {
        this.loading.dismiss().catch((error) => console.log(error));
      }
      if (event != null) {
        event.complete();
      }
    }).catch(function (error) {
      if (showLoading) {
        this.createAndShowErrorAlert(error);
      }
    });
    this.dataProvider.setActivity().then((data) => {
      this.dataActivity = this.dataProvider.dataActivity;
      this.dataActivity = _.sortBy(this.dataActivity, "distance");
      this.dataProvider.setUser().then((data) => {
        this.dataUser = this.dataProvider.dataUser;
        for (let i in this.dataUser) {
          if (this.dataUser[i].id == this.utilities.user.uid) {
            this.loggedInUserID = this.dataUser[i].id;
            this.userCategories = this.dataUser[i].categories;
            this.userRange = this.dataUser[i].range;
            this.facebookFriends = this.dataUser[i].facebookFriends;
          }
        }
        this.counterOther = 0;
        this.checkCategory();
        this.checkRange();
        this.dataProvider.setFacebookId().then((data) => {
          this.dataFacebookId = this.dataProvider.dataFacebookIds;
          this.checkFriend();
          if (showLoading) {
            this.loading.dismiss().catch((error) => console.log(error));
          }
          if (event != null) {
            event.complete();
          }
        }).catch((error) =>{
          if (showLoading) {
            this.createAndShowErrorAlert(error);
          }
        });
        if (showLoading) {
          this.loading.dismiss().catch((error) => console.log(error));
        }
        if (event != null) {
          event.complete();
        }
      }).catch((error) => {
        if (showLoading) {
          this.createAndShowErrorAlert(error);
        }
      });
      if (showLoading) {
        this.loading.dismiss().catch((error) => console.log(error));
      }
      if (event != null) {
        event.complete();
      }
    }).catch((error) => {
      if (showLoading) {
        this.createAndShowErrorAlert(error);
      }
    });
    this.dataProvider.setCategorySubs().then((data) => {
      this.dataCategorySubs = this.dataProvider.dataCategorySubs;
      if (showLoading) {
        this.loading.dismiss().catch((error) => console.log(error));
      }
      if (event != null) {
        event.complete();
      }
    }).catch((error) => {
      if (showLoading) {
        this.createAndShowErrorAlert(error);
      }
    });
  }

  createAndShowErrorAlert(error) {
    let alert = this.alertCtrl.create({
      title: 'Fehler beim Empfangen der Daten',
      message: 'Beim Empfangen der Daten ist ein Fehler aufgetreten :-(',
      buttons: ['OK']
    });
    alert.present();
  }

  createAndShowLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'ios'
    })
    this.loading.present();
  }

  checkFriend(){
    for (let i in this.facebookFriends){
      for (let j in this.dataFacebookId){
        if(i == j){
          this.facebookFriends[i]=this.dataFacebookId[j];
        }
      }
    }
    for (let i in this.dataActivity){
      for (let j in this.facebookFriends){
        if (this.dataActivity[i].creator == this.facebookFriends[j]){
          this.dataActivity[i].byFriend = true;
          this.friendActivityExists = true;
        }
      }
      if (this.dataActivity[i].categorySelected && this.dataActivity[i].inRange &&
          this.dataActivity[i].byFriend == false && this.dataActivity[i].creator != this.loggedInUserID){
        this.counterOther++;
      }
    }

  }

  checkCategory() {
    for (let i in this.dataActivity) {
      if (this.userCategories[parseInt(this.dataActivity[i].category)]) {
        this.dataActivity[i].categorySelected = true;
      }
    }
  }

  checkRange() {
    for (let i in this.dataActivity) {
      if (this.dataActivity[i].distance <= this.userRange) {
        this.dataActivity[i].inRange = true;
      } else {
        this.dataActivity[i].inRange = false;
      }
    }
  }

  checkRangeAndCounter() {
    firebase.database().ref('user/' + this.loggedInUserID + '/range').set(this.userRange);
    for (let i in this.dataActivity) {
      if (this.dataActivity[i].creator != this.loggedInUserID){
        if (this.dataActivity[i].distance <= this.userRange && this.dataActivity[i].inRange == false) {
          this.dataActivity[i].inRange = true;
          if (this.dataActivity[i].categorySelected && this.dataActivity[i].inRange &&
            this.dataActivity[i].byFriend == false){
            this.counterOther++;
          }
        } else if (this.dataActivity[i].distance > this.userRange && this.dataActivity[i].inRange){
          this.dataActivity[i].inRange = false;
          if (this.dataActivity[i].categorySelected && this.dataActivity[i].inRange == false &&
            this.dataActivity[i].byFriend == false){
            this.counterOther--;
          }
        }
      }
      
    }
  }

  createActivity(event) {
    this.navCtrl.push(CreateActivityPage);
  }

  openDetails(event, value) {
    this.navCtrl.push(ActivityDetailsPage, { activityItem: value });

  }

  doRefresh(refresher) {
    this.loadData(false, refresher);
  }

}
