import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {LiveActivityPage} from './live-activity';
import {PipesModule} from "../../pipes/pipes.module";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    LiveActivityPage,
  ],
  imports: [
    IonicPageModule.forChild(LiveActivityPage),
    ComponentsModule,
    PipesModule
  ],
})
export class LiveActivityPageModule {
}
