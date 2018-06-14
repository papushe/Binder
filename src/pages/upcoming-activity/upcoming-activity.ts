import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {ActivityService} from "../../providers/activity-service/activity-service";

@IonicPage()
@Component({
  selector: 'page-upcoming-activity',
  templateUrl: 'upcoming-activity.html',
})
export class UpcomingActivityPage {

  constructor(public activityService: ActivityService) {
  }

}
