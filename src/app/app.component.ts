import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geofence } from '@ionic-native/geofence';

import { firebaseConfig } from "./firebaseAppData";
import { ViewActivityPage } from "../pages/view-activity/view-activity";
import { SelectCategoryPage } from "../pages/select-category/select-category";
import { LoginPage } from "../pages/login/login";
import firebase from 'firebase';
import { AuthData } from "../providers/auth-data";
import { CreateActivityPage } from "../pages/create-activity/create-activity";

import { Utilities } from './utilities';

firebase.initializeApp(firebaseConfig);

@Component({
  templateUrl: 'app.html',
  providers: [Utilities, AuthData]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ViewActivityPage;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public geofence: Geofence, public authData: AuthData, public utilities: Utilities) {
    this.initializeApp();

    firebase.auth().onAuthStateChanged((user) => {
      //utilities.user = user;

      if (user != undefined) {
        //Speicher hier userdaten in Utilities oder so
        this.utilities.user = user;
        this.utilities.setUserData();
      }
      if (!user) {
        //Setze loggedin auf false und lösche den eingeloggten Spieler in utilities
        //utilities.loggedIn = false;
        //utilities.user = {};
        this.rootPage = LoginPage;
      } else {
        if (this.nav.getActive() == undefined) {
          this.rootPage = ViewActivityPage;
        }
      }
    });

    // used for an example of ngFor and navigation
    this.pages = [
      //{ title: 'Aktivität erstellen', component: CreateActivityPage },
      { title: 'Aktivitäten', component: ViewActivityPage },
      { title: 'Kategorie', component: SelectCategoryPage },
      { title: 'Login', component: LoginPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.geofence.initialize().then(
        // resolved promise does not return a value
        () => console.log('Geofence Plugin Ready'),
        (err) => console.log(err)
      );
    });
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
}
