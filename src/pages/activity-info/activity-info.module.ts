import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivityInfoPage } from './activity-info';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ActivityInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityInfoPage),
    PipesModule
  ],
})
export class ActivityInfoPageModule {}
