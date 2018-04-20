import {Component, EventEmitter, Output} from '@angular/core';
import {UserService} from "../../providers/user-service/user.service";
import {CommunityService} from "../../providers/community-service/community.service";
import {Community} from "../../models/community/community.interface";
import {NavController} from "ionic-angular";
import {Profile} from "../../models/profile/profile.interface";
import {SharedService} from "../../providers/shared/shared.service";
import {SocketService} from "../../providers/socket/socket.service";

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
              private shared: SharedService,
              private socketService: SocketService) {
    this.hasProfileEvent = new EventEmitter<boolean>();

    if (this.userService.thisAuthenticatedUser) {
      this.getProfile(this.userService.thisAuthenticatedUser)
    }

  }

  getProfile(user) {
    if ((Object.keys(this.userService.thisProfile) && Object.keys(this.userService.thisProfile).length === 0) || this.userService.thisFromCommunityDetails) {
      this.userService.thisFromCommunityDetails = false;
      if (user) {
        this.userService.getProfile(user)
          .subscribe(
            data => {
              this.userService.thisProfile = <Profile>data;
              if (this.userService.thisProfile) {
                this.socketService.socketConnect();
                this.userService.thisHasProfile = true;
                this.hasProfileEvent.emit(true);
                if (this.userService.thisProfile.communities && this.userService.thisProfile.communities.length > 0) {
                  this.getCommunities(user.uid);
                }
              } else {
                this.hasProfileEvent.emit(false);
                this.userService.thisHasProfile = false;
              }
            },
            err => {
              console.log(`error: ${err.message}`);
            },
            () => {
              //done
            }
          );
      }
    } else {
      this.getCommunities(this.userService.thisProfile.keyForFirebase);
      this.userService.thisHasProfile = true;
      this.hasProfileEvent.emit(true);
    }
  }

  getCommunities(userId) {
    this.shared.createLoader('Loading communities...');
    this.shared.loader.present().then(() => {
      this.communityService.getCommunities(userId)
        .subscribe(
          data => {
            if (Object.keys(data).length != 0) {
              this.communityService.thisCommunities = <Community>data;
              this.communities = this.communityService.thisCommunities;
              console.log(`get communities success? : ${data != null}`);
            }
          },
          err => {
            console.log(`fail to get user communities: ${err.message}`);
          },
          () => {
            //done
            this.shared.loader.dismiss();
          }
        );
    })
  }

  openCommunity(community) {
    this.navCtrl.push('CommunityDetailsPage', {community: community, from: 'communitiesComponent'})
  }
}
