import {Component, Input} from '@angular/core';
import {NavController} from "ionic-angular";
import {UserService} from "../../providers/user-service/user.service";

@Component({
  selector: 'activity-mapping',
  templateUrl: 'activity-mapping.html'
})
export class ActivityMappingComponent {

  @Input() activities;

  constructor(private navCtrl: NavController,
              public userService: UserService) {
  }

  showData(activity) {
    this.navCtrl.push('LiveActivityInfoPage', {activity: activity, isLive: activity.status.value});
  }

}
