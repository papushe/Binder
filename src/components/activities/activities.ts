import { Component } from '@angular/core';

@Component({
  selector: 'activities-component',
  templateUrl: 'activities.html'
})
export class ActivitiesComponent {

  text: string;

  constructor() {
    console.log('Hello ActivitiesComponent Component');
    this.text = 'Hello World';
  }

}
