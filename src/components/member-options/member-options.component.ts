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
  loggedInUser: Profile;
  isJoined: boolean;

  constructor(private navCtrl: NavController, private navParams: NavParams,
              private communityService: CommunityService,
              private sharedService: SharedService,
              private userService: UserService,
              private socketService: SocketService) {
  }

  ngOnInit() {
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
            this.socketService.deleteFromCommunity(this.community, userResponse, this.userService.thisProfile.keyForFirebase);
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

            //todo: send socket event and update the added user profile with res

            this.socketService.joinToCommunityByManager(this.community, res, this.userService.thisProfile.keyForFirebase);
            this.sharedService.createToast(`User joined ${this.community.communityName}`);
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
          this.navCtrl.pop().then(() => {
            this.navCtrl.pop()
          })
        });
  }

  talkToUser(member: Profile) {
    this.navCtrl.push('ChatRoomPage', {member: member});
  }

}
