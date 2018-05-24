import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivityHistoryPage } from './activity-history';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    ActivityHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityHistoryPage),
    ComponentsModule
  ],
})
export class ActivityHistoryPageModule {}
