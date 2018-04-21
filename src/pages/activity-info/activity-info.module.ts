import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivityInfoPage } from './activity-info';

@NgModule({
  declarations: [
    ActivityInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityInfoPage),
  ],
})
export class ActivityInfoPageModule {}
