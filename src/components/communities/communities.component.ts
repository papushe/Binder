import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService} from "../../providers/user-service/user.service";
import {CommunityService} from "../../providers/community-service/community.service";
import {Community} from "../../models/community/community.interface";
import {Events, NavController} from "ionic-angular";
import {Profile} from "../../models/profile/profile.interface";
import {SharedService} from "../../providers/shared/shared.service";
import {SocketService} from "../../providers/socket/socket.service";

@Component({
  selector: 'communities-component',
  templateUrl: 'communities.component.html'
})
export class CommunitiesComponent implements OnInit {

  sharedCommunityId: string;
  @Output() hasProfileEvent: EventEmitter<boolean>;
  communitySocketConnection: any;
  tabsSocketDeleteCommunity: any;

  constructor(private userService: UserService,
              public communityService: CommunityService,
              private navCtrl: NavController,
              private socketService: SocketService,
              private sharedService: SharedService,
              private events: Events) {
    this.hasProfileEvent = new EventEmitter<boolean>();
  }

  ngOnInit(): void {

    this.checkGetProfile();

    this.membersChangeEvent();

    this.deleteCommunity();

    this.events.subscribe('updateCommunities', (data) => {
      this.getProfile(this.userService.thisAuthenticatedUser);
    });
  }

  checkGetProfile() {
    if (this.userService.thisAuthenticatedUser) {
      this.getProfile(this.userService.thisAuthenticatedUser);
    }

  }

  membersChangeEvent() {
    this.communitySocketConnection = this.socketService.onGetMembersChangedEventsPrivate()
      .subscribe(
        data => {
          if (data) {
            this.handleSocket(data);
          }
        });
  }

  deleteCommunity() {
    this.tabsSocketDeleteCommunity = this.socketService.onDeleteCommunity()
      .subscribe(data => {
        if (data) {
          this.handleSocket(data);
        }
      });
  }


  handleSocket(data) {
    let thisUserName = this.userService.thisProfile.fullName;

    if (data.event == 'deleted') {
      let userFromServer = (data.user) ? data.user.keyForFirebase : '';

      if (thisUserName != data.from.fullName) {
        this.sharedService.createToast(`You were ${data.event} from ${data.communityName} community by ${data.from.fullName}`);
      }
      if (this.userService.thisProfile.keyForFirebase == userFromServer) {
        this.userService.thisProfile = data.user;
      }
    } else if (data.event == 'joined') {
      this.userService.thisProfile = data.user;

      if (thisUserName != data.from.fullName) {
        this.sharedService.createToast(`You were ${data.event} to ${data.communityName} community by ${data.from.fullName}`);
      }
    }
    if (this.navCtrl.getActive().name !== 'CommunitiesPage') {// && this.navCtrl.getActive().name !== 'TabsPage') {
      this.navCtrl.setRoot('CommunitiesPage');
    } else {
      this.getProfile(this.userService.thisAuthenticatedUser);
    }
  }

  getProfile(user) {
    if ((Object.keys(this.userService.thisProfile) && Object.keys(this.userService.thisProfile).length === 0) || this.userService.thisFromCommunityDetails) {
      this.userService.thisFromCommunityDetails = false;
      if (user) {
        this.userService.getProfile(user)
          .subscribe(
            data => {
              if (Object.keys(<Profile>data) && Object.keys(<Profile>data).length !== 0) {
                this.userService.thisProfile = <Profile>data;
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
            this.communityService.thisCommunities = <Community[]>data;
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
    this.tabsSocketDeleteCommunity.unsubscribe();
  }

}
