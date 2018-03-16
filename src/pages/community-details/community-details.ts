import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Community} from "../../models/community/community.interface";

/**
 * Generated class for the CommunityDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-community-details',
  templateUrl: 'community-details.html',
})
export class CommunityDetailsPage {
  community: Community;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.community = navParams.get('community');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityDetailsPage');
  }

}
