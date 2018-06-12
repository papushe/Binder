import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Activity} from "../../models/activity/activity.interface";
import {ActivityService} from "../../providers/activity-service/activity-service";
import {UserService} from "../../providers/user-service/user.service";
import {SocketService} from "../../providers/socket/socket.service";
import {SharedService} from "../../providers/shared/shared.service";

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
              private socketService: SocketService,
              private sharedService: SharedService) {
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
        this.navCtrl.pop();
      }, (err) => {
        console.log(err)
      }, () => {
        console.log('done finish')
      })
  }

  cancel(activity) {
    let Activity = activity;
    this.activityService.cancel(activity._id, activity.provider.id)
      .subscribe((data) => {
        console.log(data);
        this.sharedService.createToast(`You canceled ${Activity.activity_name} activity`);
        this.activityService.getActivities(this.userService.thisAuthenticatedUser);
        this.socketService.cancelActivity(<Activity>Activity);
        this.navCtrl.pop().then(() => {
          this.navCtrl.pop();
        });
      }, (err) => {
        console.log(err)
      }, () => {
        console.log('done finish')
      })
  }

  vote(vote) {
    let Vote = {
      up: vote === 'up',
      down: vote === 'down',
    };
    this.userService.vote(Vote)
      .subscribe(
        data => {
          console.log(data);
          this.voteActivity();
        },
        err => {
          console.log(`error: ${err.message}`);
        },
        () => {
          //done
          console.log('done');
        }
      );
  }

  voteActivity() {
    this.activityService.isVoteActivity(this.activity._id)
      .subscribe(
        data => {
          this.activity = <Activity>data
        },
        err => {
          console.log(`error: ${err.message}`);
        },
        () => {
          //done
          console.log('done');
          this.sharedService.createToast(`${this.activity.activity_name} voted successfully`);
        }
      );
  }
}
