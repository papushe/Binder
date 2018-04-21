import {Component, EventEmitter, Output} from '@angular/core';
import {Community} from "../../models/community/community.interface";
import {CommunityService} from "../../providers/community-service/community.service";
import {UserService} from "../../providers/user-service/user.service";
import {ToastController, NavController, NavParams} from "ionic-angular";
import {Profile} from "../../models/profile/profile.interface";

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
            this.userService.thisProfile = <Profile> data;
            if (data) {
              this.toast.create({
                message: `Community was created successfully`,
                duration: 3000
              }).present();
            }
            else {
              this.toast.create({
                message: `Failed to create community`,
                duration: 3000
              }).present();
            }
          },
          err => {
            this.toast.create({
              message: `Error: ${err.message}`,
              duration: 3000
            }).present();
          },
          () => {
            //done
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
