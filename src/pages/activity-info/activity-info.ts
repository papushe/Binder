import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Component, OnInit} from '@angular/core';
import {Community} from "../../models/community/community.interface";
import {Activity} from '../../models/activity/activity.interface';
import {Profile} from "../../models/profile/profile.interface";
import {SharedService} from "../../providers/shared/shared.service";
import {ActivityService} from "../../providers/activity-service/activity-service";
import {UserService} from "../../providers/user-service/user.service";
import {SocketService} from "../../providers/socket/socket.service";

@IonicPage()
@Component({
  selector: 'page-activity-info',
  templateUrl: 'activity-info.html',
})
export class ActivityInfoPage implements OnInit {

  activity: Activity;
  community: Community;
  profile: Profile;

  constructor(private navCtrl: NavController,
              private activityService: ActivityService,
              private sharedService: SharedService,
              private userService: UserService,
              private alertCtrl: AlertController,
              private navParams: NavParams,
              private socketService: SocketService) {

  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.community = this.navParams.get('community');
    this.activity = this.navParams.get('activity');
    this.profile = this.userService.thisProfile;
  }

  editActivity() {
    this.activity.activity_date = new Date(this.activity.activity_date).toISOString();
    this.navCtrl.push('CreateActivityPage', {activity: this.activity, community: this.community});
  }

  deleteActivityPopUp() {
    let alert = this.alertCtrl.create({
      title: 'Delete Activity',
      message: 'Are you sure you want to remove the following activity?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: data => {
            this.deleteCurrentActivity();
          }
        }
      ]
    });
    alert.present();
  }

  deleteCurrentActivity() {
    this.activityService.deleteActivity(this.activity._id)
      .subscribe(
        data => {
          if (data) {
            this.sharedService.createToast(`${this.activity.activity_name} was removed successfully`);
            this.socketService.communityChangeActivity(this.activity._id, this.activity.community_id, 'delete');
          }
          else {
            this.sharedService.createToast('Something went wrong, Please try again');
          }
        },
        err => {
          console.debug(`Failed to remove ${this.activity.activity_name} due to: ${err.message}`);
          this.sharedService.createToast(`Failed to leave ${this.activity.activity_name}`,)
        },
        () => {
          this.navCtrl.pop();
        }
      );

  }

  claimActivity() {
    this.activityService.claim(this.activity._id, this.profile.fullName, this.profile.keyForFirebase)
      .subscribe(data => {
        console.debug(`claimed activity success? : ${!!data}`);
        if (data) {
          this.activity = <Activity> data;
          this.sharedService.createToast(`You claimed ${this.activity.activity_name}`);
        }
        else {
          this.sharedService.createToast(`Failed to claim ${this.activity.activity_name}`);
        }

      }, err => {
        console.log(err.message);
        this.sharedService.createToast(`Failed to claim ${this.activity.activity_name}`);
      }, () => {
        this.navCtrl.pop();
      })
  }

  approveActivity() {
    this.activityService.approve(this.activity._id)
      .subscribe(data => {
        console.debug(`activity was approved successfully? : ${data}`);
        if (data) {
          this.activity = <Activity> data;
          this.sharedService.createToast(`Successfully approved ${this.activity.activity_name}`);
        }
        else this.sharedService.createToast(`Failed to approve ${this.activity.activity_name}`);
      }, err => {
        console.log(err.message);
        this.sharedService.createToast(`Failed to approve ${this.activity.activity_name}`);
      }, () => {
        this.navCtrl.pop()
      })
  }


}
