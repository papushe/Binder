import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Component, OnInit} from '@angular/core';
import {Community} from "../../models/community/community.interface";
import {Activity} from '../../models/activity/activity.interface';
import {SharedService} from "../../providers/shared/shared.service";
import {ActivityService} from "../../providers/activity-service/activity-service";
import {UserService} from "../../providers/user-service/user.service";
import {SocketService} from "../../providers/socket/socket.service";
import {CommunityService} from "../../providers/community-service/community.service";

@IonicPage()
@Component({
  selector: 'page-activity-info',
  templateUrl: 'activity-info.html',
})
export class ActivityInfoPage implements OnInit {

  activity: Activity;
  community: Community;

  constructor(private navCtrl: NavController,
              private activityService: ActivityService,
              public sharedService: SharedService,
              public userService: UserService,
              private alertCtrl: AlertController,
              private navParams: NavParams,
              private socketService: SocketService,
              private communityService: CommunityService) {

  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.community = this.navParams.get('community');
    let message = this.navParams.get('message');
    this.activity = this.navParams.get('activity') || message.activity;
  }

  editActivity() {
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
            //console.log('Cancel clicked');
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
            this.socketService.communityChangeActivity(this.activity, this.activity.community_id, 'delete', this.userService.thisProfile);
          }
          else {
            this.sharedService.createToast('Something went wrong, Please try again');
          }
        },
        err => {
          //console.debug(`Failed to remove ${this.activity.activity_name} due to: ${err.message}`);
          this.sharedService.createToast(`Failed to leave ${this.activity.activity_name}`,)
        },
        () => {
          this.navCtrl.pop();
        }
      );

  }

  claimActivity() {
    this.activityService.claim(this.activity._id, this.userService.thisProfile.fullName, this.userService.thisProfile.keyForFirebase)
      .subscribe(data => {
        //console.debug(`claimed activity success? : ${!!data}`);
        if (data) {
          this.activity = <Activity> data;
          this.sharedService.createToast(`You claimed ${this.activity.activity_name}`);

          this.socketService.claimedActivity(this.userService.thisProfile, this.activity, this.communityService.thisSelectedCommunity);

        }
        else {
          this.sharedService.createToast(`Failed to claim ${this.activity.activity_name}`);
        }

      }, err => {
        //console.log(err.message);
        this.sharedService.createToast(`Failed to claim ${this.activity.activity_name}`);
      }, () => {
        this.navCtrl.pop();
      })
  }

  approveActivity() {
    let user = this.activity.status;
    this.activityService.approve(this.activity._id)
      .subscribe(data => {
        //console.debug(`activity was approved successfully? : ${data}`);
        if (data) {
          this.activity = <Activity> data;
          this.sharedService.createToast(`Successfully approved ${this.activity.activity_name}`);
          this.socketService.approveActivity(this.userService.thisProfile, this.activity, this.communityService.thisSelectedCommunity, user);
        }
        else this.sharedService.createToast(`Failed to approve ${this.activity.activity_name}`);
      }, err => {
        //console.log(err.message);
        this.sharedService.createToast(`Failed to approve ${this.activity.activity_name}`);
      }, () => {
        this.navCtrl.pop()
      })
  }

  declineActivity() {
    let user = this.activity.status;
    this.activityService.decline(this.activity._id)
      .subscribe(data => {
        //console.debug(`activity was declined successfully? : ${data}`);
        if (data) {

          this.activity = <Activity> data;
          this.sharedService.createToast(`Successfully declined ${this.activity.activity_name}`);

          this.socketService.declineActivity(this.userService.thisProfile, this.activity, this.communityService.thisSelectedCommunity, user);

        }
        else this.sharedService.createToast(`Failed to decline ${this.activity.activity_name}`);
      }, err => {
        //console.log(err.message);
        this.sharedService.createToast(`Failed to decline ${this.activity.activity_name}`);
      }, () => {
        this.navCtrl.pop()
      })
  }

  openSearchPage(name) {

    let spacePosition = name.indexOf(' ');
    let tempName = '';
    tempName = name.substr(0, spacePosition);

    let claimedUser: any;
    this.userService.searchUsers(tempName)
      .subscribe(
        data => {
          claimedUser = this.findUser(data, name);
        },
        err => {
          //console.log(`error: ${err.message}`);
        },
        () => {
          //done
          this.navCtrl.push('MemberOptionsPage', {claimedUser: claimedUser})
        }
      );


  }

  findUser(users, currentUser) {
    let tempUser: any;
    if (users && users.length > 0) {
      users.forEach(user => {
        if (user.fullName == currentUser) {
          tempUser = user;
        }
      });
      return tempUser;
    }
  }


  closeModal() {
    this.navCtrl.pop();
  }

  vote(vote) {
    let Vote = {
      up: vote === 'up',
      down: vote === 'down',
    };
    this.userService.vote(Vote)
      .subscribe(
        data => {
          //console.log(data);
          this.voteActivity();
        },
        err => {
          //console.log(`error: ${err.message}`);
        },
        () => {
          //done
          //console.log('done');
          this.closeModal();
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
          //console.log(`error: ${err.message}`);
        },
        () => {
          //done
          this.activityService.getActivities(this.userService.thisAuthenticatedUser);
          //console.log('done');
          this.sharedService.createToast(`${this.activity.activity_name} voted successfully`);
        }
      );
  }


}
