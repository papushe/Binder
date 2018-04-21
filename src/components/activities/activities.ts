import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from "../../providers/user-service/user.service";
import {Community} from "../../models/community/community.interface";
import {NavController, ToastController} from "ionic-angular";
import {Activity} from '../../models/activity/activity.interface';
import {ActivityService} from '../../providers/activity-service/activity-service'
import {SocketService} from "../../providers/socket/socket.service";
import { ActivityInfoPage } from '../../pages/activity-info/activity-info'


@Component({
  selector: 'activities-component',
  templateUrl: 'activities.html'
})
export class ActivitiesComponent implements OnInit {

  activities: Activity[] = [];
  @Output() saveActivityResult: EventEmitter<any>;
  @Input() currentCommunity: Community;
  showActivities:boolean = true;

  constructor(private toast: ToastController,
              public navCtrl: NavController,
              private activityService: ActivityService,
              private userService: UserService,
              private socketService: SocketService) {

    this.saveActivityResult = new EventEmitter<any>();
  }

  ngOnInit() {
    const me = this;
    this.socketService.getCommunityNewActivity()
      .subscribe(data => {
        me.addNewActivity(data['activity']);
      });
    this.getActivitiesByCommunityId(this.currentCommunity._id)
  }


  addNewActivity(activity) {
    if (this.activities) {
      this.activities.push(activity);
    }
  }

  getActivitiesByCommunityId(communityId: string) {
    this.activityService.getActivitiesByCommunityId(communityId)
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
            message: `Error occurred while fetching activities: ${err.message}`,
            duration: 3000
          }).present();
        },
        () => {

        }
      )
  }

  openActivity(activity) {
    this.navCtrl.push('ActivityInfoPage', {activity});
  }


}
