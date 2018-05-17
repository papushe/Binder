import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {UserService} from "../../providers/user-service/user.service";
import {Community} from "../../models/community/community.interface";
import {NavController} from "ionic-angular";
import {Activity} from '../../models/activity/activity.interface';
import {ActivityService} from '../../providers/activity-service/activity-service'
import {SocketService} from "../../providers/socket/socket.service";
import {ActivityInfoPage} from '../../pages/activity-info/activity-info'
import {SharedService} from "../../providers/shared/shared.service";


@Component({
  selector: 'activities-component',
  templateUrl: 'activities.html'
})
export class ActivitiesComponent implements OnInit, OnDestroy {

  activities: Activity[] = [];
  @Output() saveActivityResult: EventEmitter<any>;
  @Input() currentCommunity: Community;
  showActivities: boolean = true;
  activitiesSocketConnection: any;

  constructor(public navCtrl: NavController,
              private activityService: ActivityService,
              private userService: UserService,
              private socketService: SocketService,
              private sharedService: SharedService) {

    this.saveActivityResult = new EventEmitter<any>();
  }

  ngOnInit() {
    this.communityChangeActivity();
  }

  communityChangeActivity() {
    this.activitiesSocketConnection = this.socketService.getCommunityChangeActivity()
      .subscribe(data => {
        if (data) {
          this.handleActivitySocket(data);
        }
      });
  }

  handleActivitySocket(data) {
    if (data.event == 'delete-activity') {
      const removeIndex = this.activities.map(function (item) {
        return item._id;
      }).indexOf(data.activity);
      if (removeIndex !== -1) {
        this.activities.splice(removeIndex, 1);
      }
    } else {
      const removeIndex = this.activities.map(function (item) {
        return item._id;
      }).indexOf(data.activity._id);
      if (removeIndex !== -1) {
        this.activities.splice(removeIndex, 1);
      }
      this.activities.push(data.activity);
    }

    if (data.from && this.userService.thisProfile.fullName != data.from) {
      this.sharedService.createToast(`${data['from']} ${data.event} - ${data['activity'].activity_name}`);
    }


  }

  getActivitiesByCommunityId(communityId: string) {
    this.activityService.getActivitiesByCommunityId(communityId, ['open', 'claimed'])
      .subscribe(
        data => {
          console.log(`got all activities successfully? : ${!!data}`);
          if (data) {
            this.activities = <Activity[]>data;
          }
          else {
            this.sharedService.createToast(`Couldn't get activities, please try again`);
          }
        },
        err => {
          this.sharedService.createToast(`Error occurred while fetching activities: ${err.message}`);
        },
        () => {
          //done
        }
      )
  }

  openActivity(activity) {
    this.navCtrl.push('ActivityInfoPage', {activity: activity, community: this.currentCommunity});
  }

  ngOnDestroy() {
    this.activitiesSocketConnection.unsubscribe();
  }
}
