import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunitiesPage } from './communities';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    CommunitiesPage,
  ],
  imports: [
    IonicPageModule.forChild(CommunitiesPage),
    ComponentsModule
  ],
})
export class CommunitiesPageModule {}
