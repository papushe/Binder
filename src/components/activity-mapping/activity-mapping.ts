import {Component, Input} from '@angular/core';

@Component({
  selector: 'activity-mapping',
  templateUrl: 'activity-mapping.html'
})
export class ActivityMappingComponent {

  @Input() activities;

  constructor() {

  }

}
