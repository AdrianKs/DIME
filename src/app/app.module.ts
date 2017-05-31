import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { ViewActivityPage } from '../pages/view-activity/view-activity';
import { CreateActivityPage } from '../pages/create-activity/create-activity';
import { SelectCategoryPage } from '../pages/select-category/select-category';
import { ActivityDetailsPage } from '../pages/activity-details/activity-details';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LoginPage} from "../pages/login/login";

@NgModule({
  declarations: [
    MyApp,
    ViewActivityPage,
    CreateActivityPage,
    SelectCategoryPage,
    LoginPage,
    ActivityDetailsPage
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
    ActivityDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
