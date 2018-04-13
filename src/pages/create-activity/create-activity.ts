import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Community} from "../../models/community/community.interface";

/**
 * Generated class for the CreateActivityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-activity',
  templateUrl: 'create-activity.html',
})
export class CreateActivityPage {

  community: Community;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.community = this.navParams.get('community')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateActivityPage');
  }

  saveActivityResult(event) {
    event ? this.navCtrl.push('CommunityDetailsPage', {community: this.community}) : console.log('No Activity was created')
  }
}
