import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, FabContainer, Events} from 'ionic-angular';
import {Community} from "../../models/community/community.interface";
import {CommunityService} from "../../providers/community-service/community.service";
import {UserService} from "../../providers/user-service/user.service";
import {Profile} from "../../models/profile/profile.interface";
import {SocketService} from "../../providers/socket/socket.service";
import {SharedService} from "../../providers/shared/shared.service";

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
              private communityService: CommunityService,
              private userService: UserService,
              private sharedService: SharedService,
              private socketService: SocketService,
              private alertCtrl: AlertController,
              private events: Events) {
  }

  ngOnInit(): void {
    this.init();
    this.isUserJoined();
    this.isUserWaiting();
    this.updateCommunityEvent();
  }

  init() {
    this.communityService.thisSelectedCommunity = this.navParams.get('community');
    this.cameFrom = this.navParams.get('from');
    this.community = this.communityService.thisSelectedCommunity;
    if (this.cameFrom == 'communitiesComponent') {
      this.socketService.enteredToCommunity(this.community);
    }
    this.profile = this.userService.thisProfile;
  }

  ionViewDidEnter() {
    this.events.publish('updateMembersCommunity', this.community);
    if (this.community && this.activitiesComponent) {
      this.activitiesComponent.getActivitiesByCommunityId(this.community._id)
    }
  }


  updateCommunityEvent() {
    this.events.subscribe('updateCommunity', (data) => {
      if (data) {
        this.communityService.thisSelectedCommunity = data;
        this.community = this.communityService.thisSelectedCommunity;
      }
    });
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

  createNewActivity(fab: FabContainer) {
    fab.close();
    this.navCtrl.push('CreateActivityPage', {community: this.communityService.thisSelectedCommunity});
  }

  addMembers(fab: FabContainer) {
    fab.close();
    this.navCtrl.push('SearchUsersPage', {community: this.community, profile: this.profile});
  }

  leavePopup(fab: FabContainer) {
    fab.close();
    let alert = this.alertCtrl.create({
      title: 'Leave Community',
      message: `Are you sure you want to leave ${this.community.communityName}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.debug('Cancel clicked');
          }
        },
        {
          text: 'Leave',
          handler: data => {
            this.leaveCommunity();
          }
        }
      ]
    });
    alert.present();
  }

  leaveCommunity() {
    this.communityService.leaveCommunity(this.community._id, this.profile.keyForFirebase)
      .subscribe(
        res => {
          console.log(`user was removed from community success? : ${!!res}`);
          if (res) {
            this.userService.thisProfile = <Profile> res;

            this.socketService.deleteFromCommunity(this.community, res, '');

            this.sharedService.createToast(`You left ${this.community.communityName}`);
          }
          else {
            this.sharedService.createToast(`Something went wrong, please try again`);
          }
        },
        err => {
          console.debug(`Failed to leave ${this.community.communityName} due to: ${err.message}`);
          this.sharedService.createToast(`Failed to leave ${this.community.communityName}`);
        },
        () => {
          //done
        }
      );
  }

  deletePopup(fab: FabContainer) {
    fab.close();
    let alert = this.alertCtrl.create({
      title: 'Delete Community',
      message: 'Are you sure you want to delete your Community?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.debug('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: data => {
            this.deleteCommunity();
          }
        }
      ]
    });
    alert.present();
  }

  deleteCommunity() {
    this.communityService.deleteCommunity(this.community._id, this.profile.keyForFirebase)
      .subscribe(
        res => {
          console.log(`community ${this.community._id} was deleted success? : ${!!res}`);
          if (res) {

            this.socketService.deleteCommunity(this.userService.thisProfile, this.community);
            this.sharedService.createToast(`You deleted ${this.community.communityName}`);
          }
          else {
            this.sharedService.createToast(`You are not allowed to delete  ${this.community.communityName}`);
          }
        },
        err => {
          console.debug(`Failed to delete ${this.community.communityName} due to: ${err.message}`);
          this.sharedService.createToast(`Failed to delete ${this.community.communityName}`);
        },
        () => {
          this.navCtrl.setRoot('CommunitiesPage', {fromCommunityDetails: true});
        });
  }

  ngOnDestroy() {
    this.socketService.leftCommunity(this.community);
  }


}
