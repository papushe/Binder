import {Component, EventEmitter, Output} from '@angular/core';
import {Account} from "../../models/account/account.interface";
import {UserService} from "../../providers/user-service/user.service";
import {LoginResponse} from "../../models/login/login-response.interface";
import {SharedService} from "../../providers/shared/shared.service";

@Component({
  selector: 'app-register-form',
  templateUrl: 'register-form.component.html'
})
export class RegisterFormComponent {

  account = {} as Account;
  @Output() registerStatus: EventEmitter<LoginResponse>;

  constructor(private userService: UserService,
              private sharedService: SharedService) {

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
      this.sharedService.createToast('Passwords do not match, try again');
    }
  }

}
