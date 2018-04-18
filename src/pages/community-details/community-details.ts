import {Component, OnInit} from '@angular/core';
import {PopoverController, AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Community} from "../../models/community/community.interface";
import {CommunityService} from "../../providers/community-service/community.service";
import {UserService} from "../../providers/user-service/user.service";
import {CreateActivityPage} from "../create-activity/create-activity"
import {Profile} from "../../models/profile/profile.interface";
import {CommunityPopoverComponent} from "../../components/community-popover/community-popover.component";
import {SocketService} from "../../providers/socket/socket.service";

/**
 * Generated class for the CommunityDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-community-details',
  templateUrl: 'community-details.html',
})
export class CommunityDetailsPage implements OnInit {

  community: Community;
  profile: Profile;
  isJoined: boolean;
  cameFrom: string;

  constructor(private navCtrl: NavController, private navParams: NavParams,
              private popoverCtrl: PopoverController,
              private communityService: CommunityService,
              private userService: UserService,
              private toast: ToastController,
              private socketService: SocketService) {
  }

  ngOnInit(): void {
    this.communityService.thisSelectedCommunity = this.navParams.get('community');
    this.cameFrom = this.navParams.get('from');
    this.community = this.communityService.thisSelectedCommunity;
    if (this.cameFrom == 'communitiesComponent') {
      this.socketService.communityChat(this.community._id);
    }
    this.profile = this.userService.thisProfile;
    this.isUserJoined(this.communityService.thisSelectedCommunity);
  }

  ionViewDidLoad() {
  }

  joinCommunity() {
    this.communityService.joinCommunity(this.communityService.thisSelectedCommunity._id, this.profile.keyForFirebase)
      .subscribe(
        res => {
          console.log(`user has joined community ${this.communityService.thisSelectedCommunity.communityName} success? : ${res == true}`);
          if (res == true) {
            this.navCtrl.setRoot('CommunitiesPage', {fromCommunityDetails: true});
            this.toast.create({
              message: `You joined ${this.communityService.thisSelectedCommunity.communityName}`,
              duration: 3000
            }).present();
          }
          else {
            this.toast.create({
              message: `You are not allowed to join  ${this.communityService.thisSelectedCommunity.communityName}`,
              duration: 3000
            }).present();
          }
        },
        err => {
          console.debug(`Failed to join ${this.communityService.thisSelectedCommunity.communityName} due to: ${err.message}`);
          this.toast.create({
            message: `Failed to join  ${this.communityService.thisSelectedCommunity.communityName}`,
            duration: 3000
          }).present();
        },
        () => {
          //done
        });
  }

  isUserJoined(community) {
    this.isJoined = false;
    this.profile.communities.forEach((userCommunity) => {
      if (community._id == userCommunity.communityId) {
        this.isJoined = true;
      }
    });
  }

  createNewActivity() {
    this.navCtrl.push('CreateActivityPage', {community: this.communityService.thisSelectedCommunity});
  }

  presentPopover(myEvent, isJoined) {
    const IsJoined = {IsJoined: isJoined};
    let popover = this.popoverCtrl.create(CommunityPopoverComponent, IsJoined);
    popover.present({
      ev: myEvent
    });
  }
}
