import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Events, NavController} from "ionic-angular";
import {Community} from "../../models/community/community.interface";
import {CommunityService} from "../../providers/community-service/community.service";
import {Profile} from "../../models/profile/profile.interface";
import {SharedService} from "../../providers/shared/shared.service";
import {UserService} from "../../providers/user-service/user.service";
import {SocketService} from "../../providers/socket/socket.service";
import {CommunityDetailsPage} from "../../pages/community-details/community-details";

@Component({
  selector: 'members-component',
  templateUrl: 'members.component.html'
})
export class MembersComponent implements OnInit, OnDestroy {

  @Input() community: Community;
  members: Profile[] = [];
  profile: Profile;
  showMembers: boolean = true;
  communitySocketConnection: any;

  constructor(private navCtrl: NavController,
              private communityService: CommunityService,
              private userService: UserService,
              private socketService: SocketService,
              private sharedService: SharedService,
              private events: Events) {
  }

  ngOnInit() {
    this.init();
    this.membersChangeEvent();
    this.updateMembersCommunityEvent();
  }

  updateMembersCommunityEvent() {
    this.events.subscribe('updateMembersCommunity', (data) => {
      this.communityService.thisSelectedCommunity = data;
      this.community = this.communityService.thisSelectedCommunity;
      this.getCommunity(this.userService.thisProfile.keyForFirebase);
    });
  }

  membersChangeEvent() {
    this.communitySocketConnection = this.socketService.onGetMembersChangedEvents()
      .subscribe(
        data => {
          if (data) {
            this.handleSocket(data);
          }
        });
  }

  init() {
    this.profile = this.userService.thisProfile;
  }

  handleSocket(data) {
    let thisUserName = this.userService.thisProfile.fullName;

    if (data.event == 'deleted') {
      let userFromServer = data.user ? data.user.keyForFirebase : '';

      this.removeMemberFromMembersObject(data.user);

      if (thisUserName != data.from.fullName) {
        this.sharedService.createToast(`${data.user.fullName} has ${data.event} from ${data.communityName} community`);
      }
      if (this.userService.thisProfile.keyForFirebase == userFromServer) {
        this.userService.thisProfile = data.user;

        if (this.navCtrl.getActive().name === 'CommunityDetailsPage') {
          this.navCtrl.pop();
        }
      }

    } else if (data.event == 'joined') {

      if (thisUserName != data.from.fullName) {
        this.sharedService.createToast(`${data.user.fullName} has ${data.event} to ${data.communityName} community`);
      }

    } else if (data.event == 'left') {

      if (data.user.fullName === thisUserName) {
        if (this.navCtrl.getActive().name !== 'CommunitiesPage') {
          this.navCtrl.setRoot('CommunitiesPage');
        }
      } else {
        this.getCommunity(this.userService.thisProfile.keyForFirebase);
      }

    }
  }

  removeMemberFromMembersObject(user) {
    const removeIndex = this.members.map(function (item) {
      return item.keyForFirebase;
    }).indexOf(user.keyForFirebase);
    if (removeIndex !== -1) {
      this.members.splice(removeIndex, 1);
    }
  }


  getCommunity(userId) {
    this.communityService.getCommunities(userId)
      .subscribe(
        community => {
          if (Object.keys(community) && Object.keys(community).length !== 0) {

            console.log(`get community success? : ${!!community}`);
            if (!Object.is(this.communityService.thisSelectedCommunity, <Community>community)) {

              let key = this.checkCommunity(community);
              if (key >= 0) {

                this.communityService.thisSelectedCommunity = <Community>community[key];
                this.community = this.communityService.thisSelectedCommunity;
                this.events.publish('updateCommunity', this.community);
                this.getCommunityMembers();

              }
            }
          }
        },
        err => {
          console.debug(`Failed to get ${this.userService.thisProfile.keyForFirebase} community due to: ${err.message}`);
        },
        () => {
          //done
        });
  }

  checkCommunity(communities): number {
    let key: number;
    Object.keys(communities).forEach((k) => {
      if (this.communityService.thisSelectedCommunity._id === communities[k]._id)
        key = Number(k);
    });
    return key;
  }


  getCommunityMembers() {
    this.communityService.getCommunityMembers(this.community._id)
      .subscribe(
        res => {
          if (res) {
            console.log(`get community members success? : ${!!res}`);
            this.communityService.thisCommunityMembers = <Profile[]>res;
            this.members = this.communityService.thisCommunityMembers
          }
          else {
            this.members = [];
          }
        },
        err => {
          console.debug(`Failed to get ${this.community._id} members due to: ${err.message}`);
        },
        () => {
          //done
        });
  }

  openOptions(member: Profile) {
    if (member.keyForFirebase != this.profile.keyForFirebase) {
      this.navCtrl.push('MemberOptionsPage', {member: member, community: this.community, isJoined: true})
    }
  }

  ngOnDestroy() {
    this.communitySocketConnection.unsubscribe();
    this.events.unsubscribe('updateMembersCommunity')
  }

}
