import {Component, EventEmitter, Output} from '@angular/core';
import {Community} from "../../models/community/community.interface";
import {CommunityService} from "../../providers/community-service/community.service";
import {Subscription} from "rxjs/Subscription";
import {User} from "firebase/app";
import {UserService} from "../../providers/user-service/user.service";
import {ToastController} from "ionic-angular";

/**
 * Generated class for the CreateCommunityFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'create-community-form',
  templateUrl: 'create-community-form.component.html'
})
export class CreateCommunityFormComponent {

  community = {} as Community;
  @Output() saveCommunityResult: EventEmitter<any>;

  constructor(private toast: ToastController,
              private userService: UserService,
              private communityService: CommunityService) {

    this.saveCommunityResult = new EventEmitter<any>();
  }

  createCommunity() {
    if (this.userService.thisAuthenticatedUser) {
      this.community.managerId = this.userService.thisAuthenticatedUser.uid;
      this.communityService.createCommunity(this.community)
        .subscribe(
          data => {
            this.saveCommunityResult.emit(data);
          },
          err => {
            this.toast.create({
              message: `Error: ${err.message}`,
              duration: 3000
            }).present();
          },
          () => {
            this.toast.create({
              message: `Community was created successfully`,
              duration: 3000
            }).present();
          }
        );
    }
  }

  checkType(communityForm) {

    if (this.community.type) {
      if (communityForm.valid) {
        return false;
      }
    }
    return true;
  }


}
