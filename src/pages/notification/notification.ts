import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Notification} from "../../models/notification/notification.interface";
import {NotificationService} from "../../providers/notitfication/notification";
import {UserService} from "../../providers/user-service/user.service";


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
export class NotificationPage {
  notifications: Notification[] = [];
  @Output() enterToNotificationPage: EventEmitter<boolean>;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              public events: Events,
              private notificationService: NotificationService,
              private userService: UserService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
    // this.getNotification();
  }

  ionViewDidEnter() {
    let message = this.navParams.get('message');
    if (message) {
      this.events.publish('enterToNotificationPage', true);
      this.notifications.push(message);
      message = undefined;
    }
  }

  handleNotificationEvent(message, from) {
    this.notifications[from].status = 'done';
    if (message.event == 'enter-to-chat-room') {
      this.navCtrl.push('ChatRoomPage', {message: message})
    }
  }

  getNotification() {
    this.notificationService.getUserNotifications(this.userService.thisProfile.keyForFirebase)
      .subscribe((notification) => {
          this.notifications = <Notification[]>notification;
        }, (err) => {
          console.log(`Failed to get user notifications ${err.message}`)
        },
        () => {
          //done
        })
  }
}
