import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { CreateActivityPage } from '../create-activity/create-activity'
import { Utilities} from '../../app/utilities';
import { ActivityDetailsPage } from '../activity-details/activity-details';
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
    this.loadData(true, null);
    this.loggedInUserID = this.utilities.user.uid;
  }

  activityOwner: String = "other";
  loggedInUserID: any;
  dataActivity: any;
  dataCategory: any;
  dataUser: any;
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
      console.log(this.dataProvider.dataCategory);
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
      console.log(this.dataProvider.dataActivity);
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
    this.dataProvider.setUser().then((data) => {
      this.dataUser = this.dataProvider.dataUser;
      console.log(this.dataProvider.dataUser);
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

  openSettings(){
    let alert = this.alertCtrl.create({
        title: 'Entfernung einstellen',
        inputs: [
          {
            name: 'radius',
            placeholder: 'Radius in km', //placeholder km
            type: 'radius'
          }
        ],
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
              //radius anpassen
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
