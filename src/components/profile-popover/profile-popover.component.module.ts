import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {ProfilePopoverComponent} from "./profile-popover.component";


@NgModule({
  declarations: [
    ProfilePopoverComponent,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePopoverComponent),
  ],
})
export class ProfilePopoverComponentModule {}
