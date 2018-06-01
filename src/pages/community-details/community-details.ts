import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, FabContainer, Events} from 'ionic-angular';
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

  isJoined: boolean = false;
  isWaiting: boolean = false;
  cameFrom: string;
  @ViewChild('child') activitiesComponent: any;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              public communityService: CommunityService,
              public userService: UserService,
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
    if (this.cameFrom == 'communitiesComponent') {
      this.socketService.enteredToCommunity(this.communityService.thisSelectedCommunity);
    }
  }

  ionViewDidEnter() {
    this.events.publish('updateMembersCommunity', this.communityService.thisSelectedCommunity);
    if (this.communityService.thisSelectedCommunity && this.activitiesComponent) {
      this.activitiesComponent.getActivitiesByCommunityId(this.communityService.thisSelectedCommunity._id)
    }
  }


  updateCommunityEvent() {
    this.events.subscribe('updateCommunity', (data) => {
      if (data) {
        this.communityService.thisSelectedCommunity = data;
      }
    });
  }

  joinCommunity() {
    if (this.communityService.thisSelectedCommunity.type.toLocaleLowerCase() !== 'private') {
      this.communityService.joinCommunity(this.communityService.thisSelectedCommunity._id, this.userService.thisProfile.keyForFirebase, false)
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
            this.socketService.askToJoinToPrivateRoom(this.userService.thisProfile, this.communityService.thisSelectedCommunity);
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

    }
  }

  isUserJoined() {
    this.userService.thisProfile.communities.forEach((userCommunity) => {
      if (this.communityService.thisSelectedCommunity._id == userCommunity.communityId) {
        this.isJoined = true;
      }
    });
  }

  isUserWaiting() {
    this.communityService.thisSelectedCommunity.waiting_list.forEach((waitingUser) => {
      if (this.userService.thisProfile.keyForFirebase === waitingUser) {
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
    this.navCtrl.push('SearchUsersPage', {
      community: this.communityService.thisSelectedCommunity,
      profile: this.userService.thisProfile
    });
  }

  leavePopup(fab: FabContainer) {
    fab.close();
    let alert = this.alertCtrl.create({
      title: 'Leave Community',
      message: `Are you sure you want to leave ${this.communityService.thisSelectedCommunity.communityName}?`,
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
    this.communityService.leaveCommunity(this.communityService.thisSelectedCommunity._id, this.userService.thisProfile.keyForFirebase)
      .subscribe(
        res => {
          console.log(`user was removed from community success? : ${!!res}`);
          if (res) {
            this.userService.thisProfile = <Profile> res;

            this.socketService.deleteFromCommunity(this.communityService.thisSelectedCommunity, res, '');

            this.sharedService.createToast(`You left ${this.communityService.thisSelectedCommunity.communityName}`);
          }
          else {
            this.sharedService.createToast(`Something went wrong, please try again`);
          }
        },
        err => {
          console.debug(`Failed to leave ${this.communityService.thisSelectedCommunity.communityName} due to: ${err.message}`);
          this.sharedService.createToast(`Failed to leave ${this.communityService.thisSelectedCommunity.communityName}`);
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
    this.communityService.deleteCommunity(this.communityService.thisSelectedCommunity._id, this.userService.thisProfile.keyForFirebase)
      .subscribe(
        res => {
          console.log(`community ${this.communityService.thisSelectedCommunity._id} was deleted success? : ${!!res}`);
          if (res) {

            this.socketService.deleteCommunity(this.userService.thisProfile, this.communityService.thisSelectedCommunity);
            this.sharedService.createToast(`You deleted ${this.communityService.thisSelectedCommunity.communityName}`);
          }
          else {
            this.sharedService.createToast(`You are not allowed to delete  ${this.communityService.thisSelectedCommunity.communityName}`);
          }
        },
        err => {
          console.debug(`Failed to delete ${this.communityService.thisSelectedCommunity.communityName} due to: ${err.message}`);
          this.sharedService.createToast(`Failed to delete ${this.communityService.thisSelectedCommunity.communityName}`);
        },
        () => {
          this.navCtrl.setRoot('CommunitiesPage', {fromCommunityDetails: true});
        });
  }

  ngOnDestroy() {
    this.socketService.leftCommunity(this.communityService.thisSelectedCommunity);
    this.events.unsubscribe('updateCommunity');
  }


}
