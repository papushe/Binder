import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Profile} from "../../models/profile/profile.interface";
import {Activity} from "../../models/activity/activity.interface";
import {UserService} from "../../providers/user-service/user.service";
import {ActivityService} from "../../providers/activity-service/activity-service";

@IonicPage()
@Component({
  selector: 'page-ongoing-activity',
  templateUrl: 'ongoing-activity.html',
})
export class OngoingActivityPage {

  activities: Activity[] = [];
  profile: Profile;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private userService: UserService,
              private activityService: ActivityService) {
  }

  ngOnInit(): void {
    this.profile = this.userService.thisProfile;
  }

  ionViewDidLoad() {
    this.activities = this.activityService.mapAs('ongoing');
  }

}
