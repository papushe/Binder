import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {Activity} from "../../models/activity/activity.interface";
import {ActivityService} from "../../providers/activity-service/activity-service";

@IonicPage()
@Component({
  selector: 'page-upcoming-activity',
  templateUrl: 'upcoming-activity.html',
})
export class UpcomingActivityPage {
  activities: Activity[] = [];

  constructor(private activityService: ActivityService) {
  }

  ionViewDidLoad() {
    this.activities = this.activityService.mapAs('approved');
  }
}
