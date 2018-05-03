import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Notification} from "../../models/notification/notification.interface";
import {NotificationService} from "../../providers/notitfication/notification";
import {UserService} from "../../providers/user-service/user.service";
import {SocketService} from "../../providers/socket/socket.service";


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
              private userService: UserService,
              private socketService: SocketService) {
  }

  ngOnInit() {
    this.notifications = this.notificationService.notifications;
  }

  ionViewDidEnter() {
    this.events.publish('enterToNotificationPage', true);
    // if (JSON.stringify(this.notifications) !== JSON.stringify(this.notificationService.notifications)) {
      this.notifications = this.notificationService.notifications;
    // }
  }

  handleNotificationEvent(message, from) {
    this.notifications[from].status = 'done';
    if (message.event == 'enter-to-chat-room') {
      this.navCtrl.push('ChatRoomPage', {message: message})
    }
  }

}
