import {Component, EventEmitter, Output} from '@angular/core';
import {Community} from "../../models/community/community.interface";
import {CommunityService} from "../../providers/community-service/community.service";
import {UserService} from "../../providers/user-service/user.service";
import {Profile} from "../../models/profile/profile.interface";
import {SharedService} from "../../providers/shared/shared.service";

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

  constructor(private userService: UserService,
              private communityService: CommunityService,
              private sharedService: SharedService) {

    this.saveCommunityResult = new EventEmitter<any>();
  }

  createCommunity() {
    if (this.userService.thisAuthenticatedUser) {
      this.community.managerId = this.userService.thisAuthenticatedUser.uid;
      this.community.managerName = this.userService.thisProfile.fullName;
      this.communityService.createCommunity(this.community)
        .subscribe(
          data => {
            this.saveCommunityResult.emit(data);
            if (data) {
              this.userService.thisProfile = <Profile> data;
              this.sharedService.createToast('Community was created successfully');
            }
            else {
              this.sharedService.createToast('Failed to create community');
            }
          },
          err => {
            this.sharedService.createToast(`Error occurred when tried to create community: ${err.message}`);
          },
          () => {
            //done
          }
        );
    }
  }
}
