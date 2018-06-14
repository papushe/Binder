import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {ActivityService} from "../../providers/activity-service/activity-service";

@IonicPage()
@Component({
  selector: 'page-live-activity',
  templateUrl: 'live-activity.html',
})
export class LiveActivityPage {

  constructor(public activityService: ActivityService) {
  }

}
