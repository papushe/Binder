import {Component, OnInit} from '@angular/core';
import {AlertController, Events, IonicPage, ModalController, NavController} from 'ionic-angular';
import {Notification} from "../../models/notification/notification.interface";
import {NotificationService} from "../../providers/notitfication/notification.service";
import {SharedService} from "../../providers/shared/shared.service";
import {CommunityService} from "../../providers/community-service/community.service";
import {UserService} from "../../providers/user-service/user.service";
import {SocketService} from "../../providers/socket/socket.service";
import {Community} from "../../models/community/community.interface";
import {CalendarService} from "../../providers/calendar-service/calendar-service";

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage implements OnInit {

  notifications: Notification[] = [];

  constructor(private navCtrl: NavController,
              private events: Events,
              private notificationService: NotificationService,
              private sharedService: SharedService,
              private alertCtrl: AlertController,
              private communityService: CommunityService,
              private calendarService: CalendarService,
              private userService: UserService,
              private socketService: SocketService,
              private modalCtrl: ModalController) {
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.notifications = this.notificationService.notifications;
  }

  ionViewDidEnter() {
    this.events.publish('enterToNotificationPage', true);
    this.notifications = this.notificationService.notifications;
  }

  handleNotificationEvent(message, from) {

    if (message.event == 'enter-to-chat-room') {
      this.navCtrl.push('ChatRoomPage', {message: message})
    } else if (message.event == 'user-ask-to-join-private-room') {
      this.openModal(message, from);
    } else if (message.event == 'on-delete-community') {
      this.getCommunities();
      this.makeNotificationRead(message, from);
    } else if (message.event == 'activity-is-about-to-start') {
      this.navCtrl.push('LiveActivityPage');
      this.makeNotificationRead(message, from);
    } else if (message.event == 'you-approved-activity') {
      this.addToCalender(message, from);
    } else {
      this.makeNotificationRead(message, from);
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

  confirmUserToJoin(message, from) {
    let alert = this.alertCtrl.create({
      title: 'Confirm User',
      message: `Do you want to allow ${message.from.fullName} to join ${message.communityName} community?`,
      buttons: [
        {
          text: 'Decline',
          role: 'cancel',
          handler: () => {
            this.cancelJoinRequest(message, from);
          }
        },
        {
          text: 'Approve',
          handler: () => {
            this.approveUserRequest(message, from);
          }
        }
      ]
    });
    alert.present();
  }

  addToCalender(message, from) {
    let alert = this.alertCtrl.create({
      title: 'Add this activity to calender?',
      message: `Do you want to add this activity ${message.activity.activity_name} to your calender?`,
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
            this.calendarService.createEvent(message.activity);
            this.makeNotificationRead(message, from);
          }
        }
      ]
    });
    alert.present();
  }

  cancelJoinRequest(message, from) {

    this.communityService.removeUserFromWaitingList(message.room, message.from.keyForFirebase)
      .subscribe(data => {
        this.sendUserDeclineNotification(message);
        this.makeNotificationRead(message, from);
        console.log(data);
      }, err => {
        console.log(err.message);
      }, () => {
        //done
      })
  }

  sendUserDeclineNotification(message) {
    this.socketService.declineUserJoinPrivateRoom(message.from, message.communityName, message.to)
  }

  approveUserRequest(message, from) {
    this.communityService.joinCommunity(message.room, message.from.keyForFirebase, true)
      .subscribe(
        res => {
          console.log(`user has joined to ${message.communityName} community  success? : ${!!res}`);
          if (res) {

            this.socketService.joinToCommunityByManager(message, res, this.userService.thisProfile);
            this.sharedService.createToast(`User joined to ${message.communityName} community`);
            this.makeNotificationRead(message, from);
          }
          else {
            this.sharedService.createToast(`Failed to join ${message.communityName} community`);
          }
        },
        err => {
          console.debug(`Failed to join ${message.content} community due to: ${err.message}`);
          this.sharedService.createToast(`Failed to join ${message.content} community`);
        },
        () => {
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
  }

  openModal(message, from) {
    let profileModal = this.modalCtrl.create('MemberOptionsPage', {user: message.user, fromNotification: true});
    profileModal.onDidDismiss(data => {
      this.confirmUserToJoin(message, from);
    });
    profileModal.present();
  }

}
