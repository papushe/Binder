import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {UpcomingActivityPage} from './upcoming-activity';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    UpcomingActivityPage,
  ],
  imports: [
    IonicPageModule.forChild(UpcomingActivityPage),
    ComponentsModule
  ],
})
export class UpcomingActivityPageModule {
}
