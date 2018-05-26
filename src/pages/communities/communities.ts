import {Component, OnInit, ViewChild} from '@angular/core';
import {FabContainer, IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserService} from "../../providers/user-service/user.service";

@IonicPage()
@Component({
  selector: 'page-communities',
  templateUrl: 'communities.html',
})
export class CommunitiesPage implements OnInit {

  hasProfile: boolean = false;
  @ViewChild('child') child;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private userService: UserService) {
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.userService.thisFromCommunityDetails = this.navParams.get('fromCommunityDetails')
  }

  updateHasProfile(hasProfile) {
    if (hasProfile) {
      this.hasProfile = this.userService.thisHasProfile;
    }
  }

  createCommunity(fab: FabContainer) {
    fab.close();
    this.navCtrl.push('CreateCommunityPage');
  }

  searchCommunity(fab: FabContainer) {
    fab.close();
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
    }, 1000);
  }

}
