import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewActivityPage } from './view-activity';

@NgModule({
  declarations: [
    ViewActivityPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewActivityPage),
  ],
  exports: [
    ViewActivityPage
  ]
})
export class ViewActivityPageModule {}
