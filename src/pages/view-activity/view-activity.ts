import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';

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
  }

  dataActivity: any;
  dataCategory: any;
  loading: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private dataProvider: DataProvider, 
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

  createActivity(event, value){

  }

  openDetails(event){
    //navparam open DetailComponent
  }

  doRefresh(refresher) {
    this.loadData(false, refresher);
  }
}
