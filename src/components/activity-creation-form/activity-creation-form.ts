import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {Activity} from '../../models/activity/activity.interface';
import {ActivityServiceProvider} from '../../providers/activity-service/activity-service';
import {UserService} from '../../providers/user-service/user.service';
import {User} from 'firebase/app';
import {ToastController, ModalController} from 'ionic-angular';
import {Community} from "../../models/community/community.interface";
import {SocketService} from "../../providers/socket/socket.service";

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
  @Input() currentCommunity: Community;

  constructor(private toast: ToastController,
              private activityService: ActivityServiceProvider,
              private userService: UserService,
              private modalCtrl: ModalController,
              private socketService: SocketService) {

    this.saveActivityResult = new EventEmitter<any>();
    this.authenticatedUser$ = this.userService.getAuthenticatedUser()
      .subscribe((user: User) => {
        this.authenticatedUser = user;
      });

  }

  createActivity() {
    if (this.authenticatedUser) {
      this.activity.consumer_id = this.authenticatedUser.uid;
      this.activity.community_id = this.currentCommunity._id;
      console.log(`ACTIVITY TO CREATE: ${this.activity.activity_name}`);
      this.activityService.createActivity(this.activity)
        .subscribe(
          data => {
            console.log(data);
            console.log(`create activity success? : ${data != null}`);
            //noinspection TypeScriptUnresolvedVariable
            this.socketService.communityNewActivity(data, this.activity.community_id);
            if (data) {
              this.toast.create({
                message: `Activity was created successfully`,
                duration: 3000
              }).present();
              this.saveActivityResult.emit(data);
            }
            else {
              this.toast.create({
                message: `Something went wrong, please try again`,
                duration: 3000
              }).present();
            }
          },
          err => {
            this.toast.create({
              message: `Error occurred while creating activity: ${err}`,
              duration: 3000
            }).present();
          },
          () => {
            //done
          }
        )
    }
  }

  showAddressModal(name) {
    let modal = this.modalCtrl.create('AutocompletePage');
    modal.onDidDismiss(data => {
      if (name == 'source')
        this.activity.source = data;
      else if (name == 'destination')
        this.activity.destination = data;
      console.log(data);
    });
    modal.present();
  }


}
