import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateCommunityPage } from './create-community';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    CreateCommunityPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateCommunityPage),
    ComponentsModule
  ],
})
export class CreateCommunityPageModule {}
