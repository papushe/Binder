import {Component, OnInit} from '@angular/core';
import {IonicPage, NavParams} from 'ionic-angular';
import {Profile} from "../../models/profile/profile.interface";
import {Community} from "../../models/community/community.interface";

@IonicPage()
@Component({
  selector: 'page-member-options',
  templateUrl: 'member-options.html',
})
export class MemberOptionsPage implements OnInit {

  member: Profile;
  community: Community;
  isJoined: boolean;
  title: string;
  fromNotification: boolean;
  messageFromNotification: any;
  from: any;

  constructor(private navParams: NavParams) {
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.member = this.navParams.get('member') || this.navParams.get('claimedUser');
    this.messageFromNotification = this.navParams.get('message');
    this.fromNotification = this.navParams.get('fromNotification');
    this.from = this.navParams.get('from');
    this.community = this.navParams.get('community');
    this.isJoined = this.navParams.get('isJoined');
    this.title = this.member ? `${this.member.fullName}` : `User Options`;
  }

}
