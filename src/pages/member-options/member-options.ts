import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Profile} from "../../models/profile/profile.interface";
import {Community} from "../../models/community/community.interface";

/**
 * Generated class for the MemberOptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-member-options',
  templateUrl: 'member-options.html',
})
export class MemberOptionsPage{

  member: Profile;
  community: Community;
  title: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.member = navParams.get('member');
    this.community = navParams.get('community');
    this.title = this.member ? `${this.member.firstName} ${this.member.lastName}` : `User Options`;
  }

  ionViewDidLoad() {
  }

}
