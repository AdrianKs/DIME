import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { ViewActivityPage } from '../pages/view-activity/view-activity';
import { SelectCategoryPage } from '../pages/select-category/select-category';
import { ActivityDetailsPage } from '../pages/activity-details/activity-details';

import { Geolocation } from '@ionic-native/geolocation';
import { Geofence } from '@ionic-native/geofence';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LoginPage} from "../pages/login/login";
import {Facebook} from "@ionic-native/facebook";
import {CreateActivityPage} from "../pages/create-activity/create-activity";
import {ProfilePage} from "../pages/profile/profile";
//import {CloudSettings, CloudModule, Push} from '@ionic/cloud-angular';
import {Push} from '@ionic-native/push';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Calendar } from '@ionic-native/calendar';

/*const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '44a1c74d'
  },
  'push': {
    'sender_id': '597985728064',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#ff0000'
      }
    }
  }
};*/

@NgModule({
  declarations: [
    MyApp,
    ViewActivityPage,
    CreateActivityPage,
    SelectCategoryPage,
    LoginPage,
    ActivityDetailsPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    //CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ViewActivityPage,
    CreateActivityPage,
    SelectCategoryPage,
    LoginPage,
    ActivityDetailsPage,
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    Geolocation,
    Geofence,
    Push,
    Diagnostic,
    Calendar,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
