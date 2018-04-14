import {Component, EventEmitter, Output} from '@angular/core';
import {Account} from "../../models/account/account.interface";
import {ToastController} from "ionic-angular";
import {UserService} from "../../providers/user-service/user.service";
import {LoginResponse} from "../../models/login/login-response.interface";

/**
 * Generated class for the RegisterFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-register-form',
  templateUrl: 'register-form.component.html'
})
export class RegisterFormComponent {

  account = {} as Account;
  @Output() registerStatus: EventEmitter<LoginResponse>;

  constructor(private userService: UserService,
              private toast: ToastController) {
    this.registerStatus = new EventEmitter<LoginResponse>();
  }

  async register() {
    if (this.account.password === this.account.passwordAgain) {
      try {
        const result = await
          this.userService.createUserWithEmailAndPassword(this.account);
        this.registerStatus.emit(result);
      } catch (e) {
        console.error(e);
        this.registerStatus.emit(e);
      }
    } else {
      this.toast.create({
        message: "Passwords do not match, try again",
        duration: 3000
      }).present();
    }
  }

}
