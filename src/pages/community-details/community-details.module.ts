import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunityDetailsPage } from './community-details';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    CommunityDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CommunityDetailsPage),
    ComponentsModule
  ],
})
export class CommunityDetailsPageModule {}
