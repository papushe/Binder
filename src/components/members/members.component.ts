import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {Community} from "../../models/community/community.interface";
import {CommunityService} from "../../providers/community-service/community.service";
import {Profile} from "../../models/profile/profile.interface";
import {SharedService} from "../../providers/shared/shared.service";
import {UserService} from "../../providers/user-service/user.service";
import {SocketService} from "../../providers/socket/socket.service";

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

  constructor(private navCtrl: NavController, private navParams: NavParams,
              private communityService: CommunityService,
              private userService: UserService,
              private socketService: SocketService,
              private sharedService: SharedService) {
  }

  ngOnInit() {
    this.getCommunityMembers();
    this.init();
    this.membersChangeEvent();
  }

  membersChangeEvent() {
    this.communitySocketConnection = this.socketService.getMembersChangedEvents()
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

      if (thisUserName != data.from) {
        this.sharedService.createToast(`${data.user.firstName} has ${data.event} from ${data.communityName} community`);
      }
      if (this.userService.thisProfile.keyForFirebase == userFromServer) {
        this.userService.thisProfile = data.user;
        this.navCtrl.setRoot('TabsPage')
      }

    }
    else if (data.event == 'joined') {
      this.getCommunityMembers();

      if (thisUserName != data.from) {
        this.sharedService.createToast(`${data.user.firstName} has ${data.event} to ${data.communityName} community`);
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
    this.getCommunityMembers();
  }

  getCommunityMembers() {
    this.communityService.getCommunityMembers(this.community._id)
      .subscribe(
        res => {
          if (res) {
            console.log(`get community members success? : ${!!res}`);
            this.members = <Profile[]>res;
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
  }

}
