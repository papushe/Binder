import {Component, Input} from '@angular/core';
import {AlertController, NavController} from "ionic-angular";
import {LiveActivityInfoPage} from "../../pages/live-activity-info/live-activity-info";

@Component({
  selector: 'activity-mapping',
  templateUrl: 'activity-mapping.html'
})
export class ActivityMappingComponent {

  @Input() activities;

  constructor(private navCtrl: NavController) {
  }

  // addToCalender(activity) {
  //   let Activity: any = activity;
  //   if (Activity.status.value === 'approved') {
  //     let alert = this.alertCtrl.create({
  //       title: 'Add this activity to calender?',
  //       message: `Do you want to add this activity ${Activity.activity_name} to your calender?`,
  //       buttons: [
  //         {
  //           text: 'Decline',
  //           role: 'cancel',
  //           handler: () => {
  //             console.log('cancel')
  //           }
  //         },
  //         {
  //           text: 'Approve',
  //           handler: () => {
  //             //TODO @naor you can add here
  //           }
  //         }
  //       ]
  //     });
  //     alert.present();
  //   }
  // }

  showData(activity) {
    this.navCtrl.push('LiveActivityInfoPage', {activity: activity, isLive: activity.status.value});
  }

}
