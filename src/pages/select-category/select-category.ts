import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { Utilities } from '../../app/utilities';
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
    this.loggedInUserData = this.utilities.userData;
    console.log(this.loggedInUserData);
    this.loadData(true, null);
  }

  loggedInUserData: any;
  dataUser: any;
  dataCategory: any;
  beer: boolean = false;
  sports: boolean = false;
  icecream: boolean = false;
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
    this.dataProvider.setUser().then((data) => {
      this.dataUser= this.dataProvider.dataUser;
      console.log("DataUser:")
      console.log(this.dataProvider.dataUser);
      for (let i in this.dataUser){
        for (let j in this.dataUser[i].categories){
          console.log(this.dataUser[i].categories);
        }
      }
      console.log(this.dataUser[0].categories);
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

  doStuff(){
    return firebase.database().ref('category').once('value', snapshot => {
        let categoryArray = [];
        let counter = 0;
        for (let i in snapshot.val()) {
            categoryArray[counter] = snapshot.val()[i];
            categoryArray[counter].id = i;
            counter++;
        }
        this.dataCategory = categoryArray;
    });
  }

  approveCategory(userItem, categoryId){
    userItem.categories[categoryId] = true;
    firebase.database().ref('user/' + userItem.id + '/categories/'+ categoryId).set(true);
  }

  disableCategory(userItem, categoryId){
    userItem.categories[categoryId] = false;
    firebase.database().ref('user/' + userItem.id + '/categories/' + categoryId).remove();
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
