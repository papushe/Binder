import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {ActivityService} from "../../providers/activity-service/activity-service";

@IonicPage()
@Component({
  selector: 'page-activity-history',
  templateUrl: 'activity-history.html',
})
export class ActivityHistoryPage {

  constructor(public activityService: ActivityService) {
  }

}
