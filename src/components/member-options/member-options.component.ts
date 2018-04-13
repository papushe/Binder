import {Component, Input} from '@angular/core';
import {Profile} from "../../models/profile/profile.interface";
import {Community} from "../../models/community/community.interface";
import {CommunityService} from "../../providers/community-service/community.service";
import {NavParams, NavController} from "ionic-angular";

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
  memberToRole: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private communityService:CommunityService) {
    console.log('Hello MemberOptionsComponent Component');
    this.text = 'Hello World';
  }


  updateUserRole() {
    this.communityService.updateCommunityUserRole(this.community._id, this.member.keyForFirebase, this.memberToRole)
      .subscribe(
        res => {
          if (res) {
            console.log(`update user role success? : ${res != null}`);
          }
        },
        err => {
          console.debug(`Failed to update ${this.member.keyForFirebase} role to: ${this.memberToRole} at community: ${this.community._id} m due to: ${err}`);
        },
        () => {
          this.navCtrl.push('CommunityDetailsPage', {community: this.community})
        });
  }

}
