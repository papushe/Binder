import {Component} from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';
import {LoginResponse} from "../../models/login/login-response.interface";
import {UserService} from "../../providers/user-service/user.service";
import {User} from "firebase/app";
import {Profile} from "../../models/profile/profile.interface";
import {SocketService} from "../../providers/socket/socket.service";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(private userService: UserService,
              private toast: ToastController,
              private navCtrl: NavController,
              private socketService: SocketService) {
  }

  login(event: LoginResponse) {
    if (!event.error) {
      this.toast.create({
        message: `Welcome to Binder, ${event.result.email}`,
        duration: 3000
      }).present();

      this.userService.getProfile(<User>event.result)
        .subscribe(
          profile => {
            this.userService.thisProfile = <Profile>profile;
            this.socketService.socketConnect();
            this.userService.thisHasProfile = true;
          },
          err => {
            console.log(`error: ${err}`);
            this.userService.thisHasProfile = false;
          },
          () => {
            console.log('done');
            this.userService.thisProfile ? this.navCtrl.setRoot("TabsPage") : this.navCtrl.setRoot('ProfilePage', {where: true});
          }
        );
    } else {
      this.toast.create({
        message: event.error.message,
        duration: 3000
      }).present();
    }
  }

}
