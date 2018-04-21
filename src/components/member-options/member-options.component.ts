import {Component, Input, OnInit} from '@angular/core';
import {Profile} from "../../models/profile/profile.interface";
import {Community} from "../../models/community/community.interface";
import {CommunityService} from "../../providers/community-service/community.service";
import {NavParams, NavController, ToastController} from "ionic-angular";
import {UserService} from "../../providers/user-service/user.service";
import {error} from "util";

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
export class MemberOptionsComponent implements OnInit{

  text: string;
  @Input() member: Profile;
  @Input() community: Community;
  loggedInUser: Profile;
  isJoined: boolean;
  isAuthorizedMember: boolean;
  roles = {
    auth:'Authorized Member',
    member:'Member'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private communityService: CommunityService,
              private toast: ToastController,
              private userService: UserService) {
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
            this.toast.create({
              message: `New Role has been updated for ${this.member.firstName} ${this.member.lastName}`,
              duration: 3000
            }).present();
          }
          else {
            console.debug(`operation failed in the server`);
            this.toast.create({
              message: `Failed to update ${this.member.firstName} ${this.member.lastName} role`,
              duration: 3000
            }).present();
          }
        },
        err => {
          console.debug(`Failed to update role for user due to: ${err.message}`);
          this.toast.create({
            message: `Failed to update ${this.member.firstName} ${this.member.lastName} role`,
            duration: 3000
          }).present();
        },
        () => {
          this.navCtrl.pop();
        });
  }

  removeUser() {
    this.communityService.leaveCommunity(this.community._id, this.member.keyForFirebase)
      .subscribe(
        res => {
          console.log(`user was removed from community success? : ${res == true}`);
          if (res == true) {
            this.toast.create({
              message: `You removed ${this.member.firstName} ${this.member.lastName} from ${this.community.communityName}`,
              duration: 3000
            }).present();
          }
          else {
            this.toast.create({
              message: `Something went wrong, please try again`,
              duration: 3000
            }).present();
          }
        },
        err => {
          console.debug(`Failed to removed ${this.member.keyForFirebase}, due to: ${err.message}`);
          this.toast.create({
            message: `Failed to removed ${this.member.firstName} ${this.member.lastName} from ${this.community.communityName}, due to: ${err.message}`,
            duration: 3000
          }).present();
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
          console.log(`user has joined community ${this.community.communityName} success? : ${res == true}`);
          if (res == true) {
            this.toast.create({
              message: `User joined ${this.community.communityName}`,
              duration: 3000
            }).present();
          }
          else {
            this.toast.create({
              message: `Failed to join ${this.community.communityName}`,
              duration: 3000
            }).present();
          }
        },
        err => {
          console.debug(`Failed to join ${this.community.communityName} due to: ${err.message}`);
          this.toast.create({
            message: `Failed to join  ${this.community.communityName}`,
            duration: 3000
          }).present();
        },
        () => {
          this.navCtrl.pop();
        });
  }
}
