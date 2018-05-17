import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
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

  constructor(private navCtrl: NavController, private navParams: NavParams) {
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.member = this.navParams.get('member');
    this.community = this.navParams.get('community');
    this.isJoined = this.navParams.get('isJoined');
    this.title = this.member ? `${this.member.fullName}` : `User Options`;
  }

}
