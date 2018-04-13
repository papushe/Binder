import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {CommunityPopoverComponent} from "./community-popover.component";


@NgModule({
  declarations: [
    CommunityPopoverComponent,
  ],
  imports: [
    IonicPageModule.forChild(CommunityPopoverComponent),
  ],
})
export class CommunityPopoverComponentModule {}
