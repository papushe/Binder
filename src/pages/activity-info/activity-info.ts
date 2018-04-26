import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
import {Community} from "../../models/community/community.interface";
import {Activity} from '../../models/activity/activity.interface';
import {Profile} from "../../models/profile/profile.interface";
import {SharedService} from "../../providers/shared/shared.service";
import {ActivityService} from "../../providers/activity-service/activity-service";


/**
 * Generated class for the ActivityInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-activity-info',
  templateUrl: 'activity-info.html',
})
export class ActivityInfoPage {

  activity: Activity;
  community: Community;
  profile: Profile;
  isJoined: boolean;



  constructor(private navCtrl: NavController,
              private activityService: ActivityService,
              private sharedService: SharedService,
              private alertCtrl: AlertController,
              private navParams: NavParams) {

    this.community = this.navParams.get('community');
    this.activity = this.navParams.get('activity');

  }


  isUserJoined(community) {
    this.isJoined = false;
    this.profile.communities.forEach((userCommunity) => {
      if (community._id == userCommunity.communityId) {
        this.isJoined = true;
      }
    });
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
    this.activityService.deleteActivity(this.activity._id, this.community._id)
      .subscribe(
        res => {
          if (res) {
            this.sharedService.createToast(`${this.activity.activity_name} was removed successfully`);
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
          // this.navCtrl.push('CommunityDetailsPage', {community: this.community, from: 'communitiesComponent'})
          this.navCtrl.pop();
        }
      );

  }


}
