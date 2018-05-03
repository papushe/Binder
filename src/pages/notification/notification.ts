import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Notification} from "../../models/notification/account.interface";



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
              public events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
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
    this.notifications[from].done = true;
    if (message.event == 'enter-to-chat-room') {
      this.navCtrl.push('ChatRoomPage', {message: message})
    }
  }

}
