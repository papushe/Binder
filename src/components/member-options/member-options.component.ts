import {Component, Input, OnInit} from '@angular/core';
import {Profile} from "../../models/profile/profile.interface";
import {Community} from "../../models/community/community.interface";
import {CommunityService} from "../../providers/community-service/community.service";
import {NavParams, NavController, ToastController} from "ionic-angular";
import {UserService} from "../../providers/user-service/user.service";

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
          if (res) {
            console.log(`update user role success? : ${res != null}`);
            this.toast.create({
              message: `New Role has been updated for ${this.member.firstName} ${this.member.lastName}`,
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
          this.navCtrl.push('CommunityDetailsPage', {community: this.community})
        });
  }
}
