import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MemberOptionsPage} from './member-options';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    MemberOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberOptionsPage),
    ComponentsModule
  ],
})
export class MemberOptionsPageModule {
}
