import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {LoginResponse} from "../../models/login/login-response.interface";
import {SharedService} from "../../providers/shared/shared.service";

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  constructor(private navCtrl: NavController,
              private sharedService:SharedService) {
  }

  register(event: LoginResponse) {
    if (!event.error) {
      this.sharedService.createToast(`Account created: ${event.result.email}`);
      this.navCtrl.setRoot('TabsPage')
    } else {
      this.sharedService.createToast(`Account not created: ${event.error.message}`);
    }
  }
}
