import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { ViewActivityPage } from '../pages/view-activity/view-activity';
import { ViewMyActivityPage } from "../pages/view-my-activity/view-my-activity";
import { SelectCategoryPage } from '../pages/select-category/select-category';
import { ActivityDetailsPage } from '../pages/activity-details/activity-details';

import { Geolocation } from '@ionic-native/geolocation';
import { Geofence } from '@ionic-native/geofence';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from "../pages/login/login";
import { Facebook } from "@ionic-native/facebook";
import { CreateActivityPage } from "../pages/create-activity/create-activity";
import { ProfilePage } from "../pages/profile/profile";
import { AboutPage } from "../pages/about/about";
import { Diagnostic } from '@ionic-native/diagnostic';
import { Calendar } from '@ionic-native/calendar';

import { Time } from './pipes/time';

@NgModule({
  declarations: [
    MyApp,
    ViewActivityPage,
    ViewMyActivityPage,
    CreateActivityPage,
    SelectCategoryPage,
    LoginPage,
    ActivityDetailsPage,
    ProfilePage,
    AboutPage,
    Time
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ViewActivityPage,
    ViewMyActivityPage,
    CreateActivityPage,
    SelectCategoryPage,
    LoginPage,
    ActivityDetailsPage,
    ProfilePage,
    AboutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    Geolocation,
    Geofence,
    Diagnostic,
    Calendar,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
