import {Component, OnInit} from '@angular/core';
import {AlertController, Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Notification} from "../../models/notification/notification.interface";
import {NotificationService} from "../../providers/notitfication/notification.service";
import {SharedService} from "../../providers/shared/shared.service";
import {CommunityService} from "../../providers/community-service/community.service";
import {UserService} from "../../providers/user-service/user.service";
import {SocketService} from "../../providers/socket/socket.service";

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage implements OnInit {

  notifications: Notification[] = [];

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private events: Events,
              private notificationService: NotificationService,
              private sharedService: SharedService,
              private alertCtrl: AlertController,
              private communityService: CommunityService,
              private userService: UserService,
              private socketService: SocketService) {
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
    let params = {
      status: 'done',
      id: message._id
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
    } else if (message.event == 'user-ask-to-join-private-room') {
      this.confirmUserToJoin(message);
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

  confirmUserToJoin(message) {
    let alert = this.alertCtrl.create({
      title: 'Confirm User',
      message: `Do you want to allow ${message.from.fullName} to join ${message.communityName} community?`,
      buttons: [
        {
          text: 'Decline',
          role: 'cancel',
          handler: () => {
            this.cancelJoinRequest(message);
          }
        },
        {
          text: 'Approve',
          handler: () => {
            this.approveUserRequest(message);
          }
        }
      ]
    });
    alert.present();
  }


  cancelJoinRequest(message) {
    this.communityService.removeUserFromWaitingList(message.room, message.from.id)
      .subscribe(data => {
        console.log(data)
        this.sendUserDeclineNotification(message);

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

  approveUserRequest(message) {
    this.communityService.joinCommunity(message.room, message.from.id, true)
      .subscribe(
        res => {
          console.log(`user has joined to ${message.communityName} community  success? : ${!!res}`);
          if (res) {

            this.socketService.joinToCommunityByManager(message, res, this.userService.thisProfile.keyForFirebase);
            this.sharedService.createToast(`User joined to ${message.communityName} community`);
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


}
