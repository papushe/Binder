import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PopoverController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Community} from "../../models/community/community.interface";
import {CommunityService} from "../../providers/community-service/community.service";
import {UserService} from "../../providers/user-service/user.service";
import {CreateActivityPage} from "../create-activity/create-activity"
import {Profile} from "../../models/profile/profile.interface";
import {CommunityPopoverComponent} from "../../components/community-popover/community-popover.component";
import {SocketService} from "../../providers/socket/socket.service";
import {SharedService} from "../../providers/shared/shared.service";

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
export class CommunityDetailsPage implements OnInit, OnDestroy {

  community: Community;
  profile: Profile;
  isJoined: boolean = false;
  isWaiting: boolean = false;
  cameFrom: string;
  @ViewChild('child') activitiesComponent: any;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private popoverCtrl: PopoverController,
              private communityService: CommunityService,
              private userService: UserService,
              private sharedService: SharedService,
              private socketService: SocketService) {
  }

  ngOnInit(): void {
    this.communityService.thisSelectedCommunity = this.navParams.get('community');
    this.cameFrom = this.navParams.get('from');
    this.community = this.communityService.thisSelectedCommunity;
    if (this.cameFrom == 'communitiesComponent') {
      this.socketService.enteredToCommunity(this.community);
    }
    this.profile = this.userService.thisProfile;
    this.isUserJoined();
    this.isUserWaiting();
  }

  ionViewDidEnter() {
    if (this.community && this.activitiesComponent) {
      this.activitiesComponent.getActivitiesByCommunityId(this.community._id)
    }
  }

  joinCommunity() {
    if (this.communityService.thisSelectedCommunity.type.toLocaleLowerCase() !== 'private') {
      this.communityService.joinCommunity(this.communityService.thisSelectedCommunity._id, this.profile.keyForFirebase, false)
        .subscribe(
          res => {
            console.debug(`You joined community ${this.communityService.thisSelectedCommunity.communityName} success? : ${!!res}`);
            if (res) {
              this.userService.thisProfile = <Profile> res;

              this.socketService.joinToCommunity(this.communityService.thisSelectedCommunity, res);

              this.navCtrl.setRoot('CommunitiesPage', {fromCommunityDetails: true});
              this.sharedService.createToast(`You joined ${this.communityService.thisSelectedCommunity.communityName}`);
            }
            else {
              this.sharedService.createToast(`Failed to join to ${this.communityService.thisSelectedCommunity.communityName}`);
            }
          },
          err => {
            console.debug(`Failed to join to ${this.communityService.thisSelectedCommunity.communityName} due to: ${err.message}`);
            this.sharedService.createToast(`Failed to join to ${this.communityService.thisSelectedCommunity.communityName}`);
          },
          () => {
            //done
          });
    } else {

      this.communityService.addUserToWaitingList(this.communityService.thisSelectedCommunity._id, this.userService.thisProfile.keyForFirebase)
        .subscribe(data => {
          console.log(`add user to waiting list success? : ${!!data}`);
          if (data) {
            this.sharedService.createToast(`Your request to join ${this.communityService.thisSelectedCommunity.communityName} sent`);
          }
          else {
            this.sharedService.createToast(`Your request to join ${this.communityService.thisSelectedCommunity.communityName} failed`);
          }
        }, err => {
          console.log(err.message);
          this.sharedService.createToast(`Your request to join ${this.communityService.thisSelectedCommunity.communityName} failed`);
        }, () => {
          this.navCtrl.setRoot('CommunitiesPage', {fromCommunityDetails: true});
        });

      this.socketService.askToJoinToPrivateRoom(this.userService.thisProfile, this.communityService.thisSelectedCommunity);

    }
  }

  isUserJoined() {
    this.profile.communities.forEach((userCommunity) => {
      if (this.communityService.thisSelectedCommunity._id == userCommunity.communityId) {
        this.isJoined = true;
      }
    });
  }

  isUserWaiting() {
    this.communityService.thisSelectedCommunity.waiting_list.forEach((waitingUser) => {
      if (this.profile.keyForFirebase === waitingUser) {
        this.isWaiting = true;
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

  ngOnDestroy() {
    this.socketService.leftCommunity(this.community);
  }


}
