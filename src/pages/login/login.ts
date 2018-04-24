import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {LoginResponse} from "../../models/login/login-response.interface";
import {UserService} from "../../providers/user-service/user.service";
import {User} from "firebase/app";
import {Profile} from "../../models/profile/profile.interface";
import {SocketService} from "../../providers/socket/socket.service";
import {SharedService} from "../../providers/shared/shared.service";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(private userService: UserService,
              private sharedService: SharedService,
              private navCtrl: NavController,
              private socketService: SocketService) {
  }

  login(event: LoginResponse) {
    if (!event.error) {
      this.sharedService.createToast(`Welcome to Binder, ${event.result.email}`);
      this.userService.getProfile(<User>event.result)
        .subscribe(
          profile => {
            this.userService.thisProfile = <Profile>profile;
            this.socketService.socketConnect();
            this.userService.thisHasProfile = true;
          },
          err => {
            console.log(`error: ${err.message}`);
            this.userService.thisHasProfile = false;
          },
          () => {
            //done
            if (this.userService.thisProfile) {
              if (this.navCtrl.getActive().name == 'LoginPage') {
                this.navCtrl.setRoot("TabsPage");
              }
            } else {
              this.navCtrl.setRoot('ProfilePage', {where: true});
            }

          }
        );
    } else {
      this.sharedService.createToast(event.error.message);
    }
  }

}
