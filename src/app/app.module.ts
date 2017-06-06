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
import {InAppBrowser} from "@ionic-native/in-app-browser";

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
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
