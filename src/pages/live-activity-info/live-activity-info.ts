import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Activity} from "../../models/activity/activity.interface";
import {ActivityService} from "../../providers/activity-service/activity-service";
import {UserService} from "../../providers/user-service/user.service";
import {SocketService} from "../../providers/socket/socket.service";

/**
 * Generated class for the LiveActivityInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-live-activity-info',
  templateUrl: 'live-activity-info.html',
})
export class LiveActivityInfoPage {

  activity: Activity;
  isLive: string = '';

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private activityService: ActivityService,
              public userService: UserService,
              private socketService: SocketService) {
    this.activity = this.navParams.get('activity');
    this.isLive = this.navParams.get('isLive');
  }

  finish(activity) {
    this.activityService.finish(activity._id)
      .subscribe((data) => {
        console.log(data);
        this.activity = <Activity>data;
        this.activityService.getActivities(this.userService.thisAuthenticatedUser);
        this.socketService.finishActivity(<Activity>data);
      }, (err) => {
        console.log(err)
      }, () => {
        console.log('done finish')
      })
  }

}
