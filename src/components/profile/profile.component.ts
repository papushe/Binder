import { Component } from '@angular/core';
import {Profile} from "../../models/user/profile.interface";

/**
 * Generated class for the ProfileComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent {

  profile = {} as Profile;

  constructor() {

  }

  saveProfile(){

  }

}
