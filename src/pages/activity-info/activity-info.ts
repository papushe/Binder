import {PopoverController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
import {Community} from "../../models/community/community.interface";
import {Activity} from '../../models/activity/activity.interface';
import {Profile} from "../../models/profile/profile.interface";


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
              private popoverCtrl: PopoverController,
              private navParams: NavParams) {

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

  presentPopover(myEvent, isJoined) {
    const IsJoined = {IsJoined: isJoined};
    // let popover = this.popoverCtrl.create(CommunityPopoverComponent, IsJoined);
    // popover.present({
    //   ev: myEvent
    // });
  }


}
