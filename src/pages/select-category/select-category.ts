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
    this.userData = this.utilities.userData;
    if (this.userData.categories!=null){
        for (let i in this.userData.categories){
          if (this.userData.categories[i]==true){
            this.categoryBoolean[i] = true;
          }
        }
    }
    console.log(this.categoryBoolean);
    this.loadData(true, null);
  }

  userData: any;
  dataCategory: any;
  noCategorySelected: boolean = false;
  categoryBoolean: Array<boolean> = [];
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
      /*if (this.userData.categories!=null){
        for (let i in this.userData.categories){
          console.log("fuck2")
          if (this.userData.categories[i]=true){
            console.log("fuck3")
            this.categoryBoolean[i] = true;
          }
        }
      } else {
        for (let i in this.dataCategory){
          this.categoryBoolean[i] = false;
        }
      }*/
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

  clicked(){
    console.log("jaha");
  }

  approveCategory(categoryId){
    this.categoryBoolean[categoryId] = true;
    firebase.database().ref('user/' + this.utilities.user.uid + '/categories/'+ categoryId).set(true);
  }

  disableCategory(categoryId){
    this.categoryBoolean[categoryId] = false;
    firebase.database().ref('user/' + this.utilities.user.uid + '/categories/'+ categoryId).remove();
  }

}
