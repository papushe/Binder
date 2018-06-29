import {Component, ViewChild} from '@angular/core';
import {FabContainer, IonicPage, NavController} from 'ionic-angular';
import {UserService} from "../../providers/user-service/user.service";

@IonicPage()
@Component({
  selector: 'page-communities',
  templateUrl: 'communities.html',
})
export class CommunitiesPage {

  @ViewChild('child') child;
  showArrow: boolean = false;
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

  createCommunity(fab: FabContainer) {
    fab.close();
    this.navCtrl.push('CreateCommunityPage');
  }

  searchCommunity(fab: FabContainer) {
    fab.close();
    this.navCtrl.push('SearchCommunityPage');
  }

  doRefresh(refresher) {
    //console.log('Begin async operation', refresher);

    setTimeout(() => {
      //console.log('Async operation has ended');
      this.child.getProfile(this.userService.thisAuthenticatedUser);
      refresher.complete();
    }, 1000);
  }

}
