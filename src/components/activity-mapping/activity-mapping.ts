import {Component, Input} from '@angular/core';
import {NavController} from "ionic-angular";

@Component({
  selector: 'activity-mapping',
  templateUrl: 'activity-mapping.html'
})
export class ActivityMappingComponent {

  @Input() activities;

  constructor(private navCtrl: NavController) {
  }

  showData(activity) {
    this.navCtrl.push('LiveActivityInfoPage', {activity: activity, isLive: activity.status.value});
  }

}
