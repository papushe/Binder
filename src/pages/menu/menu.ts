import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {UserService} from "../../providers/user-service/user.service";
import {Profile} from "../../models/profile/profile.interface";

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage implements OnInit {


  profile: Profile;
  hasProfile: boolean = false;

  constructor(private navCtrl: NavController,
              private userService: UserService) {
  }


  ngOnInit() {
    this.init();
  }

  init() {
    this.hasProfile = this.userService.thisHasProfile;
    this.profile = this.userService.thisProfile

  }

  navigateTo(page) {
    page === 'SearchUsersPage' ? this.navCtrl.push(page, {profile: this.profile}) : this.navCtrl.push(page);
  }


}
