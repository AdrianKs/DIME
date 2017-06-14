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
import {ProfilePage} from "../pages/profile/profile";
//import { Push, PushToken, PushObject } from '@ionic/cloud-angular';
import {Push, PushObject, PushOptions} from '@ionic-native/push';
//import * as FCM from 'fcm-node';
//var fcm = new FCM('AAAAizq6FkA:APA91bGHQhv3xZ8yz2wHF2qR-dcYTrINqlYHlQTuy1Vr1yapcJcuFA8g75tgnKasvZvg1L29b9u2c1d5tuMK7LINk8p4cjjzlOqpDANMSFLEM7h7vW5U-JPNgVuxPgBFmUC3vzLMVeXT');

firebase.initializeApp(firebaseConfig);

@Component({
  templateUrl: 'app.html',
  providers: [Utilities, AuthData]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ViewActivityPage;

  myProfilePage: any = {
    title: "Mein Profil",
    component: ProfilePage
  };

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public geofence: Geofence,
              public authData: AuthData,
              public utilities: Utilities,
              public push: Push) {
    this.initializeApp();

    firebase.auth().onAuthStateChanged((user) => {
      //utilities.user = user;

      if (user != undefined) {
        //Speicher hier userdaten in Utilities oder so
        this.utilities.user = user;
        this.utilities.setUserData();
        this.rootPage = ViewActivityPage;
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
      { title: 'Kategorie', component: SelectCategoryPage },
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
      /*this.push.register().then((t: PushToken) => {
        return this.push.saveToken(t);
      }).then((t: PushToken) => {
        console.log('Token saved:', t.token);
      });

      this.push.rx.notification()
        .subscribe((msg) => {
          console.log('I received awesome push: ' + msg);
          console.log(msg);
          firebase.database().ref('pushtest').push(msg.payload)
            .catch((error) => {
              console.log(error);
            });
          //alert(JSON.stringify(msg.payload));
        });*/
      this.push.hasPermission()
        .then((res: any) => {

          if (res.isEnabled) {
            console.log('We have permission to send push notifications');
          } else {
            console.log('We do not have permission to send push notifications');
          }

        });

      const options: PushOptions = {
        android: {
          senderID: '597985728064'
        },
        ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
        },
        windows: {}
      };
      const pushObject: PushObject = this.push.init(options);
      pushObject.on('notification').subscribe((notification: any) => {
        console.log('Received a notification', notification);
        firebase.database().ref('pushtest').push(notification.title)
          .catch((error) => {
            console.log(error);
          });
      });

      pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

      pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
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

/*sendPush() {
    let deviceID = 'epzU-__USXg:APA91bHP3ieifkPMJQx-VZv5EmHoN4XP08IU2dMu1J_47H-j6FE5lZJdHVmqRETZBstXAzADSgUFWwm5kQ_kCvmThUQonsQF42s97dyMxLAnC8u_k8ta3-tjWLWg9vWQwlF_iN-E5XxD';
    var message = {
      to: deviceID,
      data: {
        title: {"locKey": "push_app_title"},
        message: 'Simple non-localizable text for message!'
        // Constant with formatted params
        // message: {"locKey": "push_message_fox", "locData": ["fox", "dog"]});
      }
    };

    fcm.send(message, function(err, response){
      if (err) {
        console.log(err);
        console.log("Something has gone wrong!");
      } else {
        console.log("Successfully sent with response: ", response);
      }
    });
  }*/
}
