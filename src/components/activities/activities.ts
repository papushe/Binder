import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from "../../providers/user-service/user.service";
import {Community} from "../../models/community/community.interface";
import {ToastController} from "ionic-angular";
import {Activity} from '../../models/activity/activity.interface';
import {ActivityService} from '../../providers/activity-service/activity-service'
import {User} from "firebase";
import {Subscription} from "rxjs/Subscription";
import {SocketService} from "../../providers/socket/socket.service";


@Component({
  selector: 'activities-component',
  templateUrl: 'activities.html'
})
export class ActivitiesComponent implements OnInit {

  activities: Activity[];
  authenticatedUser: User;
  authenticatedUser$: Subscription;
  @Output() saveActivityResult: EventEmitter<any>;
  @Input() currentCommunity: Community;

  constructor(private toast: ToastController,
              private activityService: ActivityService,
              private userService: UserService,
              private socketService: SocketService) {

    this.saveActivityResult = new EventEmitter<any>();
    this.authenticatedUser$ = this.userService.getAuthenticatedUser()
      .subscribe((user: User) => {
        this.authenticatedUser = user;
      });
  }

  ngOnInit() {
    const me = this;
    this.socketService.getCommunityNewActivity()
      .subscribe(data => {
        me.addNewActivity(data['activity']);
      });
    this.getActivitiesByCommunityId(this.currentCommunity)
  }


  addNewActivity(activity) {
    if (this.activities) {
      this.activities.push(activity);
    }
  }

  getActivitiesByCommunityId(currentCommunity: Community) {
    console.log(`community name: ${currentCommunity.communityName}`);
    this.activityService.getActivitiesByCommunityId(this.currentCommunity)
      .subscribe(
        data => {
          console.log(`got all activities successfully? : ${data != null}`);
          if (data) {
            this.activities = <Activity[]>data;
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
