import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController} from 'ionic-angular';
import {UserService} from "../../providers/user-service/user.service";
import {ActivityService} from "../../providers/activity-service/activity-service";

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  constructor(private navCtrl: NavController,
              public userService: UserService,
              private alertCtrl: AlertController,
              public activityService: ActivityService) {
  }

  signOut() {
    this.signOutPopup();
  }

  deleteProfilePopup() {
    let alert = this.alertCtrl.create({
      title: 'Delete Account',
      message: 'Are you sure want to delete your Account? Enter your password first',
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
            //console.log('Cancel clicked');
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

  signOutPopup() {
    let alert = this.alertCtrl.create({
      title: 'Signing Out',
      message: 'Are you sure you want to sign out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Sign Out',
          handler: data => {
            this.userService.signOut();
          }
        }
      ]
    });
    alert.present();
  }


  navigateTo(page) {
    page === 'SearchUsersPage' ? this.navCtrl.push(page, {profile: this.userService.thisProfile}) : this.navCtrl.push(page);
  }


}
