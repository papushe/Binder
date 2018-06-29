import {Component, EventEmitter, Output} from '@angular/core';
import {UserService} from "../../providers/user-service/user.service";
import {LoginResponse} from "../../models/login/login-response.interface";
import {SharedService} from "../../providers/shared/shared.service";

@Component({
  selector: 'app-register-form',
  templateUrl: 'register-form.component.html'
})
export class RegisterFormComponent {

  @Output() registerStatus: EventEmitter<LoginResponse>;

  constructor(public userService: UserService,
              private sharedService: SharedService) {

    this.registerStatus = new EventEmitter<LoginResponse>();
  }

  async register() {
    if (this.userService.account.password === this.userService.account.passwordAgain) {
      try {
        const result = await
          this.userService.createUserWithEmailAndPassword(this.userService.account);
        this.registerStatus.emit(result);
      } catch (e) {
        //console.error(e);
        this.registerStatus.emit(e);
      }
    } else {
      this.sharedService.createToast('Passwords do not match, try again');
    }
  }

}
