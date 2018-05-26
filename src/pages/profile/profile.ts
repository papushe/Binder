import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, PopoverController} from 'ionic-angular';
import {UserService} from "../../providers/user-service/user.service";
import {ProfilePopoverComponent} from "../../components/profile-popover/profile-popover.component";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  @ViewChild('child') child;

  constructor(private userService: UserService,
              private navCtrl: NavController,
              private popoverCtrl: PopoverController) {
  }

  saveProfileResult(event) {
    event ? this.navCtrl.setRoot('CommunitiesPage') : console.log("Not authenticated or saved");
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(ProfilePopoverComponent);
    popover.present({
      ev: myEvent
    });
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
