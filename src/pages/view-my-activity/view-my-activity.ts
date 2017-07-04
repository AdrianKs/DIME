import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { CreateActivityPage } from '../create-activity/create-activity'
import { Utilities} from '../../app/utilities';
import { ActivityDetailsPage } from '../activity-details/activity-details';
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
  selector: 'page-view-my-activity',
  templateUrl: 'view-my-activity.html',
  providers: [DataProvider]
})
export class ViewMyActivityPage {

  ionViewWillEnter() {
    //this.loggedInUserID = this.utilities.user.uid;
    //console.log("userID: " + this.loggedInUserID);
    //this.userCategories = {0:true, 1:true, 2:true, 3:true, 4:true, 5:true, 6:true, 7:true};
    //this.userCategories = this.utilities.userCategories;
    this.loadData(true, null);
  }

  activityType: String = "own";
  today: String = new Date().toISOString();
  loggedInUserID: any;
  userCategories: any;
  userRange: any;
  counterOwn: any;
  counterSoon: any;
  counterPast: any;
  dataActivity: any;
  dataCategory: any;
  dataUser: any;
  dataCategorySubs: any;
  loading: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private dataProvider: DataProvider,
              private utilities: Utilities, 
              private alertCtrl: AlertController, 
              private loadingCtrl: LoadingController){
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
      if(event!=null){
        event.complete();
      }
    }).catch(function (error) {
      if (showLoading) {
        this.createAndShowErrorAlert(error);
      }
    });
    this.dataProvider.setActivity().then((data) => {
      this.dataActivity = this.dataProvider.dataActivity;
      this.dataActivity = _.sortBy(this.dataActivity, "date");
      this.dataProvider.setUser().then((data) => {
        this.dataUser = this.dataProvider.dataUser;
        for (let i in this.dataUser){
          if (this.dataUser[i].id == this.utilities.user.uid){
            this.loggedInUserID = this.dataUser[i].id;
            this.userCategories = this.dataUser[i].categories;
            this.userRange = this.dataUser[i].range;
          }
        }
        this.checkAttendance();
        this.checkCounter()
        if (showLoading) {
          this.loading.dismiss().catch((error) => console.log(error));
        }
        if(event!=null){
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
      if(event!=null){
        event.complete();
      }
    }).catch(function (error) {
      if (showLoading) {
        this.createAndShowErrorAlert(error);
      }
    });
    this.dataProvider.setCategorySubs().then((data) => {
      this.dataCategorySubs = this.dataProvider.dataCategorySubs;
      if (showLoading) {
        this.loading.dismiss().catch((error) => console.log(error));
      }
      if(event!=null){
        event.complete();
      }
    }).catch(function (error) {
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

  checkAttendance(){
    for (let i in this.dataActivity){
      for (let j in this.dataActivity[i].attendees){
        if (j == this.loggedInUserID){
          this.dataActivity[i].attended = true;
        }
      }
    }
  }

  checkCounter(){
    this.counterOwn = 0;
    this.counterSoon = 0;
    this.counterPast = 0;
    for (let i in this.dataActivity){
      if (this.dataActivity[i].creator == this.loggedInUserID){
        this.counterOwn++;
      } else {
        if (this.dataActivity[i].attended){
          if(this.dataActivity[i].date > this.today){
            this.counterSoon++;
          }else {
            this.counterPast++;
          }
        }
      }

    }
  }

  openSettings(){

  }

  createActivity(event){
    this.navCtrl.push(CreateActivityPage);
  }

  openDetails(event, value){
    this.navCtrl.push(ActivityDetailsPage, { activityItem: value});
 
  }

  doRefresh(refresher) {
    this.loadData(false, refresher);
  }
}
