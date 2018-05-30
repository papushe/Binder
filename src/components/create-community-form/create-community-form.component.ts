import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {CommunityService} from "../../providers/community-service/community.service";
import {UserService} from "../../providers/user-service/user.service";
import {Profile} from "../../models/profile/profile.interface";
import {SharedService} from "../../providers/shared/shared.service";

@Component({
  selector: 'create-community-form',
  templateUrl: 'create-community-form.component.html'
})
export class CreateCommunityFormComponent {

  @Output() saveCommunityResult: EventEmitter<any>;

  // @ViewChild('focusInput') focusInput;

  constructor(private userService: UserService,
              public communityService: CommunityService,
              private sharedService: SharedService) {

    this.saveCommunityResult = new EventEmitter<any>();
  }

  // ngAfterViewChecked() {
  //   this.focusInput.setFocus();
  // }

  createCommunity() {

    if (this.userService.thisAuthenticatedUser) {
      this.communityService.thisCommunity.manager = {
        id: this.userService.thisAuthenticatedUser.uid,
        name: this.userService.thisProfile.fullName
      };
      this.communityService.createCommunity(this.communityService.thisCommunity)
        .subscribe(
          data => {
            if (data) {
              this.userService.thisProfile = <Profile> data;
              this.sharedService.createToast('Community was created successfully');
              this.saveCommunityResult.emit(data);
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
