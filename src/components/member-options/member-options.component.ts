import {Component, Input, OnInit} from '@angular/core';
import {Profile} from "../../models/profile/profile.interface";
import {Community} from "../../models/community/community.interface";
import {CommunityService} from "../../providers/community-service/community.service";
import {NavParams, NavController} from "ionic-angular";
import {UserService} from "../../providers/user-service/user.service";
import {SocketService} from "../../providers/socket/socket.service";
import {SharedService} from "../../providers/shared/shared.service";

/**
 * Generated class for the MemberOptionsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
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
  isAuthorizedMember: boolean;
  roles = {
    auth: 'Authorized Member',
    member: 'Member'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private communityService: CommunityService,
              private sharedService: SharedService,
              private userService: UserService,
              private socketService: SocketService) {
    this.loggedInUser = this.userService.thisProfile;
    this.isJoined = navParams.get('isJoined');
  }

  ngOnInit() {
    this.member.communities.forEach(community => {
      if (community.communityId === this.community._id) {
        this.isAuthorizedMember = (community.role !== 'Member');
      }
    })
  }

  updateUserRole() {
    let role = this.isAuthorizedMember ? this.roles.member : this.roles.auth;
    this.communityService.updateCommunityUserRole(this.community._id,
      this.member.keyForFirebase, role)
      .subscribe(
        res => {
          console.log(`update user role success? : ${res == true}`);
          if (res === true) {
            this.sharedService.createToast(`New Role has been updated for ${this.member.firstName} ${this.member.lastName}`);
          }
          else {
            console.debug(`operation failed in the server`);
            this.sharedService.createToast(`Failed to update ${this.member.firstName} ${this.member.lastName} role`);
          }
        },
        err => {
          console.debug(`Failed to update role for user due to: ${err.message}`);
          this.sharedService.createToast(`Failed to update ${this.member.firstName} ${this.member.lastName} role`);
        },
        () => {
          this.navCtrl.pop();
        });
  }

  removeUser() {
    this.communityService.leaveCommunity(this.community._id, this.member.keyForFirebase)
      .subscribe(
        res => {
          console.log(`user was removed from community success? : ${!!res}`);
          if (res) {

            //TODO check response - res

            this.socketService.deleteFromCommunity(this.community, res);
            this.sharedService.createToast(`You removed ${this.member.firstName} ${this.member.lastName} from ${this.community.communityName}`);
          }
          else {
            this.sharedService.createToast(`Something went wrong, please try again`);
          }
        },
        err => {
          console.debug(`Failed to removed ${this.member.keyForFirebase}, due to: ${err.message}`);
          this.sharedService.createToast(`Failed to removed ${this.member.firstName} ${this.member.lastName} from ${this.community.communityName}, due to: ${err.message}`);
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

            this.socketService.joinToCommunity(this.community, res);
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
}
