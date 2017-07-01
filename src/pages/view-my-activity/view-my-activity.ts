import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { CreateActivityPage } from '../create-activity/create-activity'
import { Utilities} from '../../app/utilities';
import { ActivityDetailsPage } from '../activity-details/activity-details';
<<<<<<< HEAD
import * as _ from 'lodash';
=======
>>>>>>> 3491a14b448e54ab2e8fb04250bc094c7a042f2d
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
<<<<<<< HEAD
      this.dataActivity = _.sortBy(this.dataActivity, "date");
=======
>>>>>>> 3491a14b448e54ab2e8fb04250bc094c7a042f2d
      this.dataProvider.setUser().then((data) => {
        this.dataUser = this.dataProvider.dataUser;
        for (let i in this.dataUser){
          if (this.dataUser[i].id == this.utilities.user.uid){
            this.loggedInUserID = this.dataUser[i].id;
            this.userCategories = this.dataUser[i].categories;
            this.userRange = this.dataUser[i].range;
            console.log("userID: " + this.loggedInUserID);
          }
        }
        for (let i in this.dataActivity){
          if (this.userCategories[parseInt(this.dataActivity[i].category)]){
            this.dataActivity[i].categorySelected = true;
          }
        }
        this.checkRange();
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
      console.log(this.dataProvider.dataCategorySubs);
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

  checkRange(){
    for (let i in this.dataActivity){
      if (this.dataActivity[i].distance <= this.userRange){
        this.dataActivity[i].inRange = true;
      } else {
        this.dataActivity[i].inRange = false;
      }
    }
  }

  openSettings(){
    let alert = this.alertCtrl.create({
        title: 'Entfernung einstellen',
        inputs: [
          {
            name: 'range',
            min: 0,
            max: 100,
            value: this.userRange, //placeholder km
            type: 'range'
          }
        ],
        subTitle: this.userRange,
        buttons: [
          {
            text: 'Abbrechen',
            role: 'cancel',
            handler: data => {
            }
          },
          {
            text: 'Übernehmen',
            handler: data => {
              firebase.database().ref('user/' + this.loggedInUserID + '/range').set(data.range);
              this.userRange = data.range;
              this.checkRange();
            }
          }
        ]
      });
      alert.present();
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
