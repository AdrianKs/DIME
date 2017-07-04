import { Component, ViewChild, } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geofence } from '@ionic-native/geofence';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Subscription } from 'rxjs';

import { firebaseConfig } from "./firebaseAppData";
import { ViewActivityPage } from "../pages/view-activity/view-activity";
import { ViewMyActivityPage } from "../pages/view-my-activity/view-my-activity";
import { SelectCategoryPage } from "../pages/select-category/select-category";
import { LoginPage } from "../pages/login/login";
import { AboutPage } from "../pages/about/about";
import firebase from 'firebase';
import { AuthData } from "../providers/auth-data";
import { CreateActivityPage } from "../pages/create-activity/create-activity";
import { ActivityDetailsPage } from '../pages/activity-details/activity-details';

import { Utilities } from './utilities';
import { ProfilePage } from "../pages/profile/profile"
import { Deeplinks } from '@ionic-native/deeplinks';

firebase.initializeApp(firebaseConfig);

@Component({
  templateUrl: 'app.html',
  providers: [Utilities, AuthData]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  private onResumeSubscription: Subscription;

  rootPage: any;

  aboutPage: any = {
    title: "About",
    component: AboutPage
  };

  myProfilePage: any = {
    title: "Mein Profil",
    component: ProfilePage
  };

  pages: Array<{ title: string, component: any, icon: string }>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public alertCtrl: AlertController,
              public diagnostic: Diagnostic,
              public splashScreen: SplashScreen,
              public geofence: Geofence,
              public deeplinks: Deeplinks,
              public authData: AuthData,
              public utilities: Utilities) {
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
        this.rootPage = LoginPage;
        this.utilities.user = {};
      }
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Aktivitäten', component: ViewActivityPage, icon: "people"},
      { title: 'Meine Aktivitäten', component: ViewMyActivityPage, icon: "contact"},
      { title: 'Kategorie', component: SelectCategoryPage, icon: "archive" }
    ];

  }

  initializeApp() {
    this.platform.ready().then((source) => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //Check if location services are enabled
      this.checkLocation();

      this.utilities.platform = source;
      this.deeplinks.routeWithNavController(this.nav, {
        '/about-us': AboutPage,
        '/activity/:id': ActivityDetailsPage
      }).subscribe((match) => {
        console.log('Successfully routed', match);
      }, (nomatch) => {
        console.warn('Unmatched Route', nomatch);
      });


      if (!(source === "dom")) {
        window["plugins"].OneSignal
          .startInit("3b4c0e22-1465-4978-ba3c-2d198bf1de6e", "597985728064")
          .handleNotificationOpened(this.handlePushNotificationCallback())
          .endInit();
      }
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
        this.geofence.initialize().then(() => {
          console.log('Geofence Plugin Ready');
          this.watchGeofence();
        }).catch((err) => {
          console.log(err)
        });
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  handlePushNotificationCallback() {
    return (jsonData) => {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };
  }

  watchGeofence() {
    console.log("watchgeofence");
    this.geofence.onTransitionReceived().subscribe(res => {
      let tempRes = res;
      let value;
      tempRes.forEach(location => {
        value = {
          creator: location.notification.data.creator,
          date: location.notification.data.date,
          locationName: location.notification.data.locationName,
          description: location.notification.data.description,
          id: location.notification.data.id,
          attendees: location.notification.data.attendees,
          category: location.notification.data.category
        }
        this.openConfirmMessage(value.id, value.description);
      });
    }, (err) => {
      console.log(err);
    });
  }
  openConfirmMessage(id, description) {
    let alert = this.alertCtrl.create({
      title: "Neues Event",
      subTitle: "In der Nähe befindet sich ein neues Event: " + description + "Details ansehen?",
      buttons: [
        {
          text: "Abbrechen",
          role: "cancel",
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: "Zur Aktivität",
          handler: () => {
            this.nav.push(ActivityDetailsPage, { id: id });
          }
        }
      ]
    });
    alert.present();
  }

}
