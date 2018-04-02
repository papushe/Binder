import { Component } from '@angular/core';

/**
 * Generated class for the ActivityCreationFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'activity-creation-form',
  templateUrl: 'activity-creation-form.html'
})
export class ActivityCreationFormComponent {

  text: string;

  constructor() {
    console.log('Hello ActivityCreationFormComponent Component');
    this.text = 'Hello World';
  }

}
