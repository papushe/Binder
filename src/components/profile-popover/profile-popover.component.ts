import {Component} from '@angular/core';
import {AlertController, ViewController} from "ionic-angular";
import {UserService} from "../../providers/user-service/user.service";

@Component({
  selector: 'popover',
  templateUrl: 'profile-popover.component.html'
})
export class ProfilePopoverComponent {

  constructor(private viewCtrl: ViewController,
              private userService: UserService,
              private alertCtrl: AlertController) {
  }

  close() {
    this.viewCtrl.dismiss();
  }

  signOut() {
    this.close();
    this.userService.signOut();
  }

  deleteProfilePopup() {
    this.close();
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

}
