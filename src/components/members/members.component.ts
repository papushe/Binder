import {Component, Input} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {Community} from "../../models/community/community.interface";
import {CommunityService} from "../../providers/community-service/community.service";
import {Profile} from "../../models/profile/profile.interface";
import {MemberOptionsComponent} from "../member-options/member-options.component";
import {SharedService} from "../../providers/shared/shared.service";

/**
 * Generated class for the MembersComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'members-component',
  templateUrl: 'members.component.html'
})
export class MembersComponent {
  @Input() community: Community;
  members: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private communityService: CommunityService) {
  }

  ngOnInit() {
    this.getCommunityMembers();
  }

  getCommunityMembers() {
    this.communityService.getCommunityMembers(this.community._id)
      .subscribe(
        res => {
          if (res) {
            console.log(`get community members success? : ${res != null}`);
            this.members = res;
          }
          else {
            this.members = [];
          }
        },
        err => {
          console.debug(`Failed to get ${this.community._id} members due to: ${err}`);
        },
        () => {
          //done
        });
  }

  openOptions(member: Profile) {
    this.navCtrl.push('MemberOptionsPage', {member})
  }


}
