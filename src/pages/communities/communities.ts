import {Component, OnInit, ViewChild} from '@angular/core';
import {FabContainer, IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserService} from "../../providers/user-service/user.service";
import {Profile} from "../../models/profile/profile.interface";

@IonicPage()
@Component({
  selector: 'page-communities',
  templateUrl: 'communities.html',
})
export class CommunitiesPage implements OnInit {

  hasProfile: boolean = false;
  @ViewChild('child') child;
  profile: Profile;
  showArrow: boolean;
  date = new Date();
  updateTime: any;

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
      this.profile = this.userService.thisProfile;
      this.showArrow = this.profile && this.profile.communities.length == 0;
      this.hasProfile = this.userService.thisHasProfile;
    }
  }

  toggleArrow() {
    this.showArrow = false;
  }

  refreshDate() {
    this.updateTime = setInterval(() => {
      this.date = new Date();
    }, 1000)
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
    this.refreshDate();
    this.hasProfile = this.userService.thisHasProfile;
  }

  ionViewDidLeave() {
    clearInterval(this.updateTime);
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
