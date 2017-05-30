import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import firebase from 'firebase';

/**
 * Generated class for the SelectCategoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-select-category',
  templateUrl: 'select-category.html',
   providers: [DataProvider]
})
export class SelectCategoryPage {

  ionViewWillEnter() {
    this.loadData(true, null);
  }

  dataActivity: any;
  dataCategory: any;
  beer: boolean = false;
  sports: boolean = false;
  icecream: boolean = false;
  loading: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private dataProvider: DataProvider, 
              private alertCtrl: AlertController, 
              private loadingCtrl: LoadingController){
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApproveQuotes');
  }

  loadData(showLoading: boolean, event): void {
    /*if (showLoading) {
      this.createAndShowLoading();
    }
    console.log("geht los")
    this.dataProvider.setCategory().then((data) => {
      console.log("FJFIJIFJ")
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
    /*console.log("commence")
    this.dataProvider.setActivity().then((data) => {
      console.log("fuck")
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
    });*/
  }

  doStuff(){
    console.log("komm schon")
    return firebase.database().ref('category').once('value', snapshot => {
        console.log("digga")
        let categoryArray = [];
        let counter = 0;
        for (let i in snapshot.val()) {
            categoryArray[counter] = snapshot.val()[i];
            categoryArray[counter].id = i;
            counter++;
        }
        this.dataCategory = categoryArray;
        console.log(this.dataCategory);
    });
  }

  approveCategory(category){
    category = category.toString();
    if (category == 'beer'){
      this.beer = true;
    } else if (category == 'icecream'){
      this.icecream = true;
    } else {
      this.sports = true;
    }
  }

  disableCategory(category){
  if (category == 'beer'){
      this.beer = false;
    } else if (category == 'icecream'){
      this.icecream = false;
    } else {
      this.sports = false;
    }
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

  doRefresh(refresher) {
    this.loadData(false, refresher);
  }
}
