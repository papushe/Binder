import {Component, EventEmitter, Output} from '@angular/core';
import {NavController} from "ionic-angular";
import {Account} from "../../models/account/account.interface";
import {LoginResponse} from "../../models/login/login-response.interface";
import {UserService} from "../../providers/user-service/user.service";

@Component({
  selector: 'app-login-form',
  templateUrl: 'login-form.component.html'
})
export class LoginFormComponent {

  account = {} as Account;

  @Output() loginStatus: EventEmitter<LoginResponse>;

  constructor(private userService: UserService,
              private navCtrl: NavController) {
    this.loginStatus = new EventEmitter<LoginResponse>();
  }

  async login() {
    const loginResponse = await this.userService.signInWithEmailAndPassword(this.account);

    this.userService.thisAuthenticatedUser$ = this.userService.getAuthenticatedUser()
      .subscribe(
        auth => {
          if (auth) {
            this.userService.thisAuthenticatedUser = auth;
            this.loginStatus.emit(loginResponse);
          } else {
            this.userService.thisAuthenticatedUser$.unsubscribe();
            this.navCtrl.setRoot('LoginPage')
          }
        });
  }

  navigateToRegisterPage() {
    this.navCtrl.push('RegisterPage');
  }

}
