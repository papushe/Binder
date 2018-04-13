import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {PopoverComponent} from "./popover";


@NgModule({
  declarations: [
    PopoverComponent,
  ],
  imports: [
    IonicPageModule.forChild(PopoverComponent),
  ],
})
export class PopoverComponentModule {}
