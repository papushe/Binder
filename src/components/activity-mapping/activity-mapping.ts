import {Component, Input} from '@angular/core';
import {AlertController} from "ionic-angular";

@Component({
  selector: 'activity-mapping',
  templateUrl: 'activity-mapping.html'
})
export class ActivityMappingComponent {

  @Input() activities;

  constructor(private alertCtrl: AlertController) {
  }

  addToCalender(activity) {
    let Activity: any = activity;
    if (Activity.status.value === 'approved') {
      let alert = this.alertCtrl.create({
        title: 'Add this activity to calender?',
        message: `Do you want to add this activity ${Activity.activity_name} to your calender?`,
        buttons: [
          {
            text: 'Decline',
            role: 'cancel',
            handler: () => {
              console.log('cancel')
            }
          },
          {
            text: 'Approve',
            handler: () => {
              //TODO @naor you can add here
            }
          }
        ]
      });
      alert.present();
    }
  }
}
