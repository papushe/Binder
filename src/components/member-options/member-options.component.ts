import {Component, Input} from '@angular/core';
import {Profile} from "../../models/profile/profile.interface";

/**
 * Generated class for the MemberOptionsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'member-options',
  templateUrl: 'member-options.component.html'
})
export class MemberOptionsComponent {

  text: string;
  @Input() member: Profile;
  memberToRole: string;

  constructor() {
    console.log('Hello MemberOptionsComponent Component');
    this.text = 'Hello World';
  }


  setNewRole(){

  }

}
