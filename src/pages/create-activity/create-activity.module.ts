import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateActivityPage } from './create-activity';

@NgModule({
  declarations: [
    CreateActivityPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateActivityPage),
  ],
  exports: [
    CreateActivityPage
  ]
})
export class CreateActivityPageModule {}
