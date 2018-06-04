import {Component} from '@angular/core';
import {AlertController, Events, IonicPage, ModalController, NavController} from 'ionic-angular';
import {Notification} from "../../models/notification/notification.interface";
import {NotificationService} from "../../providers/notitfication/notification.service";
import {SharedService} from "../../providers/shared/shared.service";
import {CommunityService} from "../../providers/community-service/community.service";
import {UserService} from "../../providers/user-service/user.service";
import {SocketService} from "../../providers/socket/socket.service";
import {Community} from "../../models/community/community.interface";
import {CalendarService} from "../../providers/calendar-service/calendar-service";
import {ActivityService} from "../../providers/activity-service/activity-service";

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage {

  constructor(private navCtrl: NavController,
              private events: Events,
              public notificationService: NotificationService,
              private sharedService: SharedService,
              private alertCtrl: AlertController,
              private communityService: CommunityService,
              private calendarService: CalendarService,
              private userService: UserService,
              private socketService: SocketService,
              private modalCtrl: ModalController,
              private activityService: ActivityService) {
  }

  ionViewDidEnter() {
    this.events.publish('enterToNotificationPage', true);
  }

  handleNotificationEvent(message, from) {

    if (message.event == 'enter-to-chat-room') {
      this.navCtrl.push('ChatRoomPage', {message: message});
      this.makeNotificationRead(message, from);
    } else if (message.event == 'user-ask-to-join-private-room') {
      this.openModal('MemberOptionsPage', message, from);
    } else if (message.event == 'on-delete-community') {
      this.getCommunities();
      this.makeNotificationRead(message, from);
    } else if (message.event == 'activity-is-about-to-start') {
      this.navCtrl.push('LiveActivityPage');
      this.makeNotificationRead(message, from);
    } else if (message.event == 'activity-finish') {
      this.openModal('ActivityInfoPage', message, from);
    } else if (message.event == 'activity-canceled') {
      this.activityService.getActivities(this.userService.thisAuthenticatedUser);
      this.makeNotificationRead(message, from);
    } else {
      this.makeNotificationRead(message, from);
    }
  }

  deleteNotification(notification, from) {
    this.notificationService.deleteNotification(notification._id)
      .subscribe(data => {
        if (data === true) {
          this.notificationService.notifications.splice(from, 1);
        }
      }, err => {
        console.log(`Failed to delete notification, ${err}`);
        this.sharedService.createToast(`Failed to delete notification, ${err}`);
      }, () => {
        //done
      });
  }

  getCommunities() {
    this.communityService.getCommunities(this.userService.thisProfile.keyForFirebase)
      .subscribe(data => {
        this.communityService.thisCommunities = <Community[]>data;
      }, err => {
        console.log(err)
      }, () => {
        console.log('done')
      })
  }

  makeNotificationRead(message, from) {
    let params = {
      status: 'done',
      keyForFirebase: message._id
    };

    this.notificationService.updateUserNotification(params, 'notificationPage')
      .subscribe(data => {
        console.log(data);
        this.notificationService.notifications[from] = <Notification>data;
      }, err => {
        console.log(`Faild to save notification, ${err}`)
      }, () => {
        //done
      });
  }

  openModal(page, message, from) {
    let profileModal = this.modalCtrl.create(page, {
      message: message,
      fromNotification: true,
      from: from
    });
    profileModal.onDidDismiss(data => {
      this.makeNotificationRead(message, from);
    });
    profileModal.present();
  }

}
