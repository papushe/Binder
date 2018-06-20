import {Component, ViewChild} from '@angular/core';
import {FabContainer, IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserService} from "../../providers/user-service/user.service";

@IonicPage()
@Component({
  selector: 'page-communities',
  templateUrl: 'communities.html',
})
export class CommunitiesPage {

  @ViewChild('child') child;
  showArrow: boolean = false;
  date = new Date();
  updateTime: any;
  showDirection: boolean = false;

  constructor(private navCtrl: NavController,
              public userService: UserService) {
  }

  updateHasProfile(hasProfile) {
    if (hasProfile) {
      this.showArrow = this.userService.thisProfile && this.userService.thisProfile.communities.length == 0;
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
