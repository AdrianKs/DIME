import { Component, ViewChild, } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geofence } from '@ionic-native/geofence';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Subscription } from 'rxjs';

import { firebaseConfig } from "./firebaseAppData";
import { ViewActivityPage } from "../pages/view-activity/view-activity";
import { SelectCategoryPage } from "../pages/select-category/select-category";
import { LoginPage } from "../pages/login/login";
import { AboutPage } from "../pages/about/about";
import firebase from 'firebase';
import { AuthData } from "../providers/auth-data";
import { CreateActivityPage } from "../pages/create-activity/create-activity";

import { Utilities } from './utilities';
import { ProfilePage } from "../pages/profile/profile";

firebase.initializeApp(firebaseConfig);

@Component({
  templateUrl: 'app.html',
  providers: [Utilities, AuthData]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  private onResumeSubscription: Subscription;

  rootPage: any = ViewActivityPage;

  aboutPage: any = {
    title: "About",
    component: AboutPage
  };

  myProfilePage: any = {
    title: "Mein Profil",
    component: ProfilePage
  };

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public alertCtrl: AlertController, public diagnostic: Diagnostic, public splashScreen: SplashScreen, public geofence: Geofence, public authData: AuthData, public utilities: Utilities) {
    this.initializeApp();

    firebase.auth().onAuthStateChanged((user) => {
      //utilities.user = user;

      if (user != undefined) {
        //Speicher hier userdaten in Utilities oder so
        this.utilities.user = user;
        this.utilities.setUserData();
        this.rootPage = ViewActivityPage;
        this.onResumeSubscription = platform.resume.subscribe(() => {
          console.log("subscription started");
          this.checkLocation();
        });
      }
      if (!user) {
        //Setze loggedin auf false und lösche den eingeloggten Spieler in utilities
        //utilities.loggedIn = false;
        //utilities.user = {};
        this.rootPage = LoginPage;
        this.utilities.user = {};
      }
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Aktivität erstellen', component: CreateActivityPage },
      { title: 'Aktivitäten', component: ViewActivityPage },
      { title: 'Kategorie', component: SelectCategoryPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //Check if location services are enabled
      this.checkLocation();
    });
  }

  ngOnDestroy() {
    // always unsubscribe your subscriptions to prevent leaks
    console.log("subscription dead");
    this.onResumeSubscription.unsubscribe();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    this.authData.logout();
    this.nav.setRoot(LoginPage);
  }

  checkLocation() {
    this.diagnostic.isLocationEnabled().then((res) => {
      if (res == false) {
        let alert = this.alertCtrl.create({
          title: "Warnung",
          subTitle: "Sie müssen die Standortdienste aktivieren damit die App verwendet werden kann",
          buttons: [
            {
              text: "Zu Einstellungen",
              role: "cancel",
              handler: () => {
                console.log('Cancel clicked');
                this.diagnostic.switchToLocationSettings();
              }
            }
          ]
        });
        alert.present();
      } else {
        this.geofence.initialize().then(
          // resolved promise does not return a value
          () => console.log('Geofence Plugin Ready'),
          (err) => console.log(err)
        );
      }
    })
      .catch((error) => {
        console.log(error);
      })
  }

}
