import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController} from 'ionic-angular';
import {UserService} from "../../providers/user-service/user.service";
import {Profile} from "../../models/profile/profile.interface";

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {


  profile: Profile;
  hasProfile: boolean = false;

  constructor(private navCtrl: NavController,
              private userService: UserService,
              private alertCtrl: AlertController) {
  }

  ionViewDidEnter() {
    this.hasProfile = this.userService.thisHasProfile;
    this.profile = this.userService.thisProfile
  }

  signOut() {
    this.userService.signOut();
  }

  deleteProfilePopup() {
    let alert = this.alertCtrl.create({
      title: 'Delete Account',
      message: 'Do you Really want to delete your Account? Enter your password first',
      inputs: [
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: data => {
            this.userService.deleteFromFirebase(this.userService.thisAuthenticatedUser, data.password);
          }
        }
      ]
    });
    alert.present();
  }


  navigateTo(page) {
    page === 'SearchUsersPage' ? this.navCtrl.push(page, {profile: this.profile}) : this.navCtrl.push(page);
  }


}
