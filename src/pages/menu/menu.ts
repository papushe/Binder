import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserService} from "../../providers/user-service/user.service";
import {Profile} from "../../models/profile/profile.interface";

/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage implements OnInit {


  profile: Profile;
  hasProfile: boolean = false;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private userService: UserService) {
  }


  ngOnInit(): void {
    this.hasProfile = this.userService.thisHasProfile;
    this.profile = this.userService.thisProfile
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  navigateTo(page) {
    this.navCtrl.push(page)
  }


}
