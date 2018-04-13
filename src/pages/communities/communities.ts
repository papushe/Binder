import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {CreateCommunityPage} from "../create-community/create-community";
import {SearchCommunityPage} from "../search-community/search-community";
import {UserService} from "../../providers/user-service/user.service";

/**
 * Generated class for the InboxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-communities',
  templateUrl: 'communities.html',
})
export class CommunitiesPage {

  hasProfile: boolean;
  @ViewChild('child') child;

  constructor(private navCtrl: NavController,
              public navParams: NavParams,
              private userService: UserService) {
    this.userService.thisFromCommunityDetails = this.navParams.get('fromCommunityDetails')
  }

  updateHasProfile(hasProfile) {
    if (hasProfile) {
      this.hasProfile = this.userService.thisHasProfile;
    }
  }

  createCommunity() {
    this.navCtrl.push('CreateCommunityPage');
  }

  searchCommunity() {
    this.navCtrl.push('SearchCommunityPage');
  }

  ionViewWillEnter() {
    this.hasProfile = this.userService.thisHasProfile;
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      this.child.getProfile(this.userService.thisAuthenticatedUser);
      refresher.complete();
    }, 2000);
  }

}
