import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Activity} from '../../models/activity/activity.interface';
import {ActivityService} from '../../providers/activity-service/activity-service';
import {UserService} from '../../providers/user-service/user.service';
import {ModalController} from 'ionic-angular';
import {Community} from "../../models/community/community.interface";
import {SocketService} from "../../providers/socket/socket.service";
import {SharedService} from "../../providers/shared/shared.service";

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
export class ActivityCreationFormComponent implements OnInit {

  activity = {} as Activity;

  @Output() saveActivityResult: EventEmitter<any>;
  @Input() currentCommunity: Community;
  @Input() currentActivity: Activity;
  now: string = new Date().toISOString();

  constructor(private sharedService: SharedService,
              private activityService: ActivityService,
              private userService: UserService,
              private modalCtrl: ModalController,
              private socketService: SocketService) {

    this.saveActivityResult = new EventEmitter<any>();

  }

  ngOnInit() {
    if (this.currentActivity) {
      this.activity = this.currentActivity;
      // this.activity.activity_date =
    }
  }

  enterActivityDetails() {

  }


  createActivity(actionRequired) {
    if (this.userService.thisAuthenticatedUser) {
      this.activity.consumer = {
        id: this.userService.thisProfile.keyForFirebase,
        name: `${this.userService.thisProfile.firstName} ${this.userService.thisProfile.lastName}`
      };
      this.activity.community_id = this.currentCommunity._id;
      if (actionRequired == 'create') {
        this.activityService.createActivity(this.activity)
          .subscribe(
            data => {
              console.log(`create activity success? : ${data != null}`);
              this.socketService.communityChangeActivity(data, this.activity.community_id, 'create');
              if (data) {
                this.sharedService.createToast(`${this.activity.activity_name} was created successfully`);
                this.saveActivityResult.emit(data);
              }
              else {
                this.sharedService.createToast('Something went wrong, please try again');
              }
            },
            err => {
              this.sharedService.createToast(`Error occurred while creating activity: ${err.message}`);
            },
            () => {
              //done
            }
          )
      }
      else if (actionRequired == 'update') {
        this.activityService.updateActivity(this.activity)
          .subscribe(
            data => {
              console.log(`successfully updated activity? : ${data != null}`);
              this.socketService.communityChangeActivity(data, this.activity.community_id, 'update');
              if (data) {
                this.sharedService.createToast(`${this.activity.activity_name} was updated successfully`);
                this.saveActivityResult.emit(data);
              }
              else {
                this.sharedService.createToast('Something went wrong, please try again');
              }
            },
            err => {
              this.sharedService.createToast(`Error occurred while updating activity: ${err.message}`);
            },
            () => {
              //done
            }
          )
      }
    }
  }

  showAddressModal(name) {
    let modal = this.modalCtrl.create('AutocompletePage');
    modal.onDidDismiss(data => {
      if (name == 'source')
        this.activity.source = data;
      else if (name == 'destination')
        this.activity.destination = data;
    });
    modal.present();
  }

  activityDateOptions: any = {
    buttons: [{
      text: 'Clear',
      handler: () => {
        this.activity.activity_date = null;
      }
    }]
  };

}

