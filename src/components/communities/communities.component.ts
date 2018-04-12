import {Component, EventEmitter, Output} from '@angular/core';
import {UserService} from "../../providers/user-service/user.service";
import {CommunityService} from "../../providers/community-service/community.service";
import {Community} from "../../models/community/community.interface";
import {NavController} from "ionic-angular";
import {Profile} from "../../models/profile/profile.interface";
import {SharedService} from "../../providers/shared/shared";

@Component({
  selector: 'communities-component',
  templateUrl: 'communities.component.html'
})
export class CommunitiesComponent {

  communities: Community;
  sharedCommunityId: string;
  @Output() hasProfileEvent: EventEmitter<boolean>;

  constructor(private userService: UserService,
              private communityService: CommunityService,
              public navCtrl: NavController,
              private shared: SharedService) {
    this.hasProfileEvent = new EventEmitter<boolean>();

    if (this.userService.thisAuthenticatedUser) {
      this.getProfile(this.userService.thisAuthenticatedUser)
    }
  }

  getProfile(user) {
    if (Object.keys(this.userService.thisProfile).length === 0) {
      if (user) {
        this.userService.getProfile(user)
          .subscribe(
            data => {
              this.userService.thisProfile = <Profile>data;
              if (this.userService.thisProfile) {
                this.userService.thisHasProfile = true;
                this.hasProfileEvent.emit(true);
                if (this.userService.thisProfile.communities.length > 0) {
                  this.getCommunities(user);
                }
              } else {
                this.hasProfileEvent.emit(false);
                this.userService.thisHasProfile = false;
              }
            },
            err => {
              console.log(`error: ${err}`);
            },
            () => {
              console.log('done');
            }
          );
      }
    } else {
      this.getCommunities(this.userService.thisAuthenticatedUser);
      this.userService.thisHasProfile = true;
      this.hasProfileEvent.emit(true);
    }
  }

  getCommunities(user) {
    this.shared.createLoader('Loading communities...');
    this.shared.loader.present().then(() => {
      this.communityService.getCommunities(user)
        .subscribe(
          data => {
            if (Object.keys(data).length != 0) {
              this.communityService.thisCommunity = <Community>data;
              this.communities = this.communityService.thisCommunity;
              console.log(`get communities success? : ${data != null}`);
            }
          },
          err => {
            console.log(`fail to get user communities: ${err}`);
          },
          () => {
            //done
            this.shared.loader.dismiss();
          }
        );
    })
  }

  openCommunity(community) {
    this.navCtrl.push('CommunityDetailsPage', {community: community, isUserJoined: true})
  }
}
