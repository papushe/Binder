import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService} from "../../providers/user-service/user.service";
import {CommunityService} from "../../providers/community-service/community.service";
import {Community} from "../../models/community/community.interface";
import {NavController} from "ionic-angular";
import {Profile} from "../../models/profile/profile.interface";
import {SharedService} from "../../providers/shared/shared.service";
import {SocketService} from "../../providers/socket/socket.service";
import {NotificationService} from "../../providers/notitfication/notification";
import {Notification} from "../../models/notification/notification.interface";

@Component({
  selector: 'communities-component',
  templateUrl: 'communities.component.html'
})
export class CommunitiesComponent implements OnInit {

  communities: Community;
  sharedCommunityId: string;
  @Output() hasProfileEvent: EventEmitter<boolean>;
  communitySocketConnection: any;

  constructor(private userService: UserService,
              private communityService: CommunityService,
              public navCtrl: NavController,
              private socketService: SocketService,
              private sharedService: SharedService,
              private notificationService: NotificationService) {
    this.hasProfileEvent = new EventEmitter<boolean>();

    if (this.userService.thisAuthenticatedUser) {
      this.getProfile(this.userService.thisAuthenticatedUser);
    }

  }

  ngOnInit(): void {
    this.communitySocketConnection = this.socketService.getMembersChangedEventsPrivate()
      .subscribe(data => {
        this.handleSocket(data);
      });
  }

  handleSocket(data) {
    let thisUserName = this.userService.thisProfile.firstName + ' ' + this.userService.thisProfile.lastName;

    console.log(data);
    if (data.event == 'deleted') {
      let userFromServer = data['user'].keyForFirebase;

      if (thisUserName != data.from) {
        this.sharedService.createToast(`You were ${data.event} from ${data.communityName} community by ${data.from}`);
      }
      if (this.userService.thisProfile.keyForFirebase == userFromServer) {

        // this.updateUserProfile(data.user, data.communityId);
        this.userService.thisProfile = data.user;
        this.getProfile(this.userService.thisAuthenticatedUser)
      }

    } else if (data.event == 'joined') {

      this.userService.thisProfile = data.user;
      this.getProfile(this.userService.thisAuthenticatedUser);
      if (thisUserName != data.from) {

        this.sharedService.createToast(`You were ${data.event} to ${data.communityName} community by ${data.from}`);

      }
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
    this.sharedService.createLoader('Loading communities...');
    this.sharedService.loader.present().then(() => {
      this.communityService.getCommunities(userId)
        .subscribe(
          data => {
            this.communityService.thisCommunities = <Community>data;
            this.communities = this.communityService.thisCommunities;
            console.log(`get communities success? : ${data != null}`);
          },
          err => {
            console.log(`fail to get user communities: ${err.message}`);
          },
          () => {
            //done
            this.sharedService.loader.dismiss();
          }
        );
    })
  }

  openCommunity(community) {
    this.navCtrl.push('CommunityDetailsPage', {community: community, from: 'communitiesComponent'})
  }

  ngOnDestroy() {
    this.communitySocketConnection.unsubscribe();
  }

}
