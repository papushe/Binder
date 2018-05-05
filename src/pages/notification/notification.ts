import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Notification} from "../../models/notification/notification.interface";
import {NotificationService} from "../../providers/notitfication/notification";
import {SharedService} from "../../providers/shared/shared.service";


/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage implements OnInit {

  notifications: Notification[] = [];

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              public events: Events,
              private notificationService: NotificationService,
              private sharedService: SharedService) {
  }

  ngOnInit() {
    this.notifications = this.notificationService.notifications;
  }

  ionViewDidEnter() {
    this.events.publish('enterToNotificationPage', true);
    this.notifications = this.notificationService.notifications;
  }

  handleNotificationEvent(message, from) {
    let params = {
      status: 'done',
      id: message.to.id
    };

    this.notificationService.updateUserNotification(params)
      .subscribe(data => {
        console.log(data);
        this.notificationService.notifications[from] = <Notification>data;
        this.notifications = this.notificationService.notifications;
      }, err => {
        console.log(`Faild to save notification, ${err}`)
      }, () => {
        //done
      });


    if (message.event == 'enter-to-chat-room') {
      this.navCtrl.push('ChatRoomPage', {message: message})
    }
  }

  deleteNotification(notification, from) {
    this.notificationService.deleteNotification(notification._id)
      .subscribe(data => {
        if (data === true) {
          this.notificationService.notifications.splice(from, 1);
          this.notifications = this.notificationService.notifications;
          this.sharedService.createToast(`Notification was deleted successfully`);
        }
      }, err => {
        console.log(`Failed to delete notification, ${err}`);
        this.sharedService.createToast(`Failed to delete notification, ${err}`);
      }, () => {
        //done
      });
  }


}
