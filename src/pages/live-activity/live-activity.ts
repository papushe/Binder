import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Activity} from "../../models/activity/activity.interface";
import {ActivityService} from "../../providers/activity-service/activity-service";
import {Profile} from "../../models/profile/profile.interface";
import {UserService} from "../../providers/user-service/user.service";

@IonicPage()
@Component({
  selector: 'page-live-activity',
  templateUrl: 'live-activity.html',
})
export class LiveActivityPage implements OnInit {
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

  ionViewDidEnter() {
    this.activities = this.activityService.mapAs('live');
  }

}
