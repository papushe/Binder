import {Component, Input, OnInit} from '@angular/core';
import {Profile} from "../../models/profile/profile.interface";
import {Community} from "../../models/community/community.interface";
import {CommunityService} from "../../providers/community-service/community.service";
import {NavParams, NavController} from "ionic-angular";
import {UserService} from "../../providers/user-service/user.service";
import {SocketService} from "../../providers/socket/socket.service";
import {SharedService} from "../../providers/shared/shared.service";

@Component({
  selector: 'member-options',
  templateUrl: 'member-options.component.html'
})
export class MemberOptionsComponent implements OnInit {

  text: string;
  @Input() member: Profile;
  @Input() community: Community;
  @Input() fromNotification: string = '';
  @Input() messageFromNotification: any;
  @Input() from: any;
  message: any;
  loggedInUser: Profile;
  isJoined: boolean;

  constructor(private navCtrl: NavController, private navParams: NavParams,
              private communityService: CommunityService,
              private sharedService: SharedService,
              public userService: UserService,
              private socketService: SocketService) {
  }

  ngOnInit() {
    if (this.messageFromNotification) {
      this.member = this.messageFromNotification.user;
      this.message = this.messageFromNotification;
    }
    this.init();
  }

  init() {
    this.loggedInUser = this.userService.thisProfile;
    this.isJoined = this.navParams.get('isJoined');
  }

  removeUser() {
    this.communityService.leaveCommunity(this.community._id, this.member.keyForFirebase)
      .subscribe(
        userResponse => {
          console.log(`user was removed from community success? : ${!!userResponse}`);
          if (userResponse) {
            this.socketService.deleteFromCommunity(this.community, userResponse, this.userService.thisProfile);
            this.sharedService.createToast(`You removed ${this.member.fullName} from ${this.community.communityName}`);
          }
          else {
            this.sharedService.createToast(`Something went wrong, please try again`);
          }
        },
        err => {
          console.debug(`Failed to removed ${this.member.keyForFirebase}, due to: ${err.message}`);
          this.sharedService.createToast(`Failed to removed ${this.member.fullName}from ${this.community.communityName}, due to: ${err.message}`);
        },
        () => {
          this.navCtrl.pop();
        }
      );
  }

  addUser() {
    this.communityService.joinCommunity(this.community._id, this.member.keyForFirebase, true)
      .subscribe(
        res => {
          console.log(`user has joined community ${this.community.communityName} success? : ${!!res}`);
          if (res) {

            this.socketService.joinToCommunityByManager(this.community, res, this.userService.thisProfile);
            // this.sharedService.createToast(`User joined ${this.community.communityName}`);
          }
          else {
            this.sharedService.createToast(`Failed to join ${this.community.communityName}`);
          }
        },
        err => {
          console.debug(`Failed to join ${this.community.communityName} due to: ${err.message}`);
          this.sharedService.createToast(`Failed to join  ${this.community.communityName}`);
        },
        () => {

          this.navCtrl.setRoot('CommunitiesPage').then(()=>{
            this.navCtrl.push('CommunityDetailsPage', {community: this.community, from: 'communitiesComponent'})
          });
          // this.navCtrl.pop().then(() => {
          //   this.navCtrl.pop()
          // })
        });
  }

  talkToUser(member: Profile) {
    this.navCtrl.push('ChatRoomPage', {member: member});
  }

  closeModal() {
    this.navCtrl.pop();
  }


  cancelJoinRequest(message, from) {

    this.communityService.removeUserFromWaitingList(message.room, message.from.keyForFirebase)
      .subscribe(data => {
        this.sendUserDeclineNotification(message);
        console.log(data);
      }, err => {
        console.log(err.message);
      }, () => {
        //done
        this.closeModal();
      })
  }

  approve() {
    this.approveUserRequest(this.message, this.from);
  }

  decline() {
    this.cancelJoinRequest(this.message, this.from);
  }

  approveUserRequest(message, from) {
    this.communityService.joinCommunity(message.room, message.from.keyForFirebase, true)
      .subscribe(
        res => {
          console.log(`user has joined to ${message.communityName} community  success? : ${!!res}`);
          if (res) {

            this.socketService.joinToCommunityByManager(message, res, this.userService.thisProfile);
            this.sharedService.createToast(`User joined to ${message.communityName} community`);
            // this.makeNotificationRead(message, from);
          }
          else {
            this.sharedService.createToast(`Failed to join ${message.communityName} community`);
          }
        },
        err => {
          console.debug(`Failed to join ${message.content} community due to: ${err.message}`);
          this.sharedService.createToast(`Failed to join ${message.content} community`);
        },
        () => {
          //done
          this.closeModal();
        });
  }

  sendUserDeclineNotification(message) {
    this.socketService.declineUserJoinPrivateRoom(message.from, message.communityName, message.to)
  }

}
