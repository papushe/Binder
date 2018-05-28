import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LiveActivityInfoPage } from './live-activity-info';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    LiveActivityInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(LiveActivityInfoPage),
    PipesModule
  ],
})
export class LiveActivityInfoPageModule {}
