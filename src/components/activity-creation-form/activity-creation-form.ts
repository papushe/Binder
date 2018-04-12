import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {Activity} from '../../models/activity/activity.interface';
import {ActivityServiceProvider} from '../../providers/activity-service/activity-service';
import {CommunityService} from '../../providers/community-service/community.service';
import {UserService} from '../../providers/user-service/user.service';
import {User} from 'firebase/app';
import {ToastController, ModalController} from 'ionic-angular';
import {Community} from "../../models/community/community.interface";

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
              private communityService: CommunityService,
              private modalCtrl: ModalController) {

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
      this.activityService.createActivity(this.activity)
        .subscribe(
          data => {
            this.saveActivityResult.emit(data);
            console.log(data);
            console.log(`create activity success? : ${data != null}`);
            //noinspection TypeScriptUnresolvedVariable
            if (data) {
              this.toast.create({
                message: `Activity was created successfully`,
                duration: 3000
              }).present();
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
      if(name == 'source')
        this.activity.source = data;
      else if (name == 'destination')
        this.activity.destination = data;
      console.log(data);
    });
    modal.present();
  }


}
