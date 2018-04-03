import {Component, EventEmitter, Output} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import { Activity } from '../../models/activity/activity.interface';
import { ActivityServiceProvider } from '../../providers/activity-service/activity-service';
import { CommunityService } from '../../providers/community-service/community.service';
import { UserService } from '../../providers/user-service/user.service';
import { User } from 'firebase/app';
import { ToastController } from 'ionic-angular';
import { Community } from "../../models/community/community.interface";

/**
 * Generated class for the ActivityCreationFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'activity-creation-form',
  templateUrl: 'activity-creation-form.html'
})
export class ActivityCreationFormComponent {

  activity = {} as Activity;
  authenticatedUser: User;
  authenticatedUser$: Subscription;
  @Output() saveActivityResult: EventEmitter<any>;

  constructor(private toast: ToastController,
              private activityService: ActivityServiceProvider,
              private userService: UserService,
              private communityService: CommunityService) {

    this.saveActivityResult = new EventEmitter<any>();
    this.authenticatedUser$ = this.userService.getAuthenticatedUser()
      .subscribe((user: User) => {
        this.authenticatedUser = user;
      });

  }

  createActivity() {
    if (this.authenticatedUser) {
      this.activityService.createActivity(this.activity)
        .subscribe(
          data => {
            this.saveActivityResult.emit(data);
            console.log(`activity data: ${data}`);
          },
          err => {
            this.toast.create({
              message: `Error while creating activity: ${err}`,
              duration: 3000
            }).present();
          },
          () => {
            this.toast.create({
              message: `Activity was created successfully`,
              duration: 3000
            }).present();
          }
        )
    }
  }

}
