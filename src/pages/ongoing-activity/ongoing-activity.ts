import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {ActivityService} from "../../providers/activity-service/activity-service";

@IonicPage()
@Component({
  selector: 'page-ongoing-activity',
  templateUrl: 'ongoing-activity.html',
})
export class OngoingActivityPage {

  constructor(public activityService: ActivityService) {
  }

}
