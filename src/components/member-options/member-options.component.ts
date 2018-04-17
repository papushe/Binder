import {Component, Input} from '@angular/core';
import {Profile} from "../../models/profile/profile.interface";
import {Community} from "../../models/community/community.interface";
import {CommunityService} from "../../providers/community-service/community.service";
import {NavParams, NavController} from "ionic-angular";
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
export class MemberOptionsComponent {

  text: string;
  @Input() member: Profile;
  @Input() community: Community;
  loggedInUser: Profile;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private communityService: CommunityService,
              private userService: UserService) {
    this.loggedInUser = this.userService.thisProfile;
  }

  updateUserRole(role: string) {
    this.communityService.updateCommunityUserRole(this.community._id, this.member.keyForFirebase, role)
      .subscribe(
        res => {
          if (res) {
            console.log(`update user role success? : ${res != null}`);
          }
        },
        err => {
          console.debug(`Failed to update ${this.member.keyForFirebase} role to: ${role} at community: ${this.community._id} m due to: ${err.message}`);
        },
        () => {
          this.navCtrl.push('CommunityDetailsPage', {community: this.community})
        });
  }
}
