import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from "../../providers/user-service/user.service";
import {Community} from "../../models/community/community.interface";
import {ToastController} from "ionic-angular";
import { Activity } from '../../models/activity/activity.interface';
import { ActivityServiceProvider } from '../../providers/activity-service/activity-service'
import {User} from "firebase";
import {Subscription} from "rxjs/Subscription";


@Component({
  selector: 'activities-component',
  templateUrl: 'activities.html'
})
export class ActivitiesComponent implements OnInit{

  activities : Activity;
  authenticatedUser: User;
  authenticatedUser$: Subscription;
  @Output() saveActivityResult: EventEmitter<any>;
  @Input() currentCommunity: Community;

  constructor(private toast: ToastController,
              private activityService: ActivityServiceProvider,
              private userService: UserService) {

    this.saveActivityResult = new EventEmitter<any>();
    this.authenticatedUser$ = this.userService.getAuthenticatedUser()
      .subscribe((user: User) => {
        this.authenticatedUser = user;
      });


  }

  ngOnInit() {
    this.getActivitiesByCommunityId(this.currentCommunity)
  }
  getActivitiesByCommunityId(currentCommunity: Community) {
    console.log(`community name: ${currentCommunity.communityName}`);
      this.activityService.getActivitiesByCommunityId(this.currentCommunity)
        .subscribe(
          data => {
            console.log(`got all activities successfully? : ${data != null}`);
            if (data) {
              this.activities = <Activity>data;
            }
            else {
              this.toast.create({
                message: `Couldn't get activities, please try again`,
                duration: 3000
              }).present();
            }
          },
          err => {
            this.toast.create({
              message: `Error occurred while fetching activities: ${err}`,
              duration: 3000
            }).present();
          },
          () => {

          }
        )
  }


}
