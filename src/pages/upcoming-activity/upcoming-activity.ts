import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserService} from "../../providers/user-service/user.service";
import {Activity} from "../../models/activity/activity.interface";
import {Profile} from "../../models/profile/profile.interface";
import {ActivityService} from "../../providers/activity-service/activity-service";

/**
 * Generated class for the UpcomingActivityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upcoming-activity',
  templateUrl: 'upcoming-activity.html',
})
export class UpcomingActivityPage {
  activities: Activity[] = [];
  profile: Profile;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private userService: UserService,
              private activityService: ActivityService) {
  }


  ngOnInit(): void {
    this.profile = this.userService.thisProfile;
  }

  ionViewDidLoad() {
    this.activities = this.activityService.mapAs('approved');
  }

}
