import {Component, Input} from '@angular/core';
import {AlertController, NavController} from "ionic-angular";
import {LiveActivityInfoPage} from "../../pages/live-activity-info/live-activity-info";

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
