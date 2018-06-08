import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OngoingActivityPage } from './ongoing-activity';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    OngoingActivityPage,
  ],
  imports: [
    IonicPageModule.forChild(OngoingActivityPage),
    ComponentsModule
  ],
})
export class OngoingActivityPageModule {}
