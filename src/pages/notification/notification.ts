import {Component, OnInit} from '@angular/core';
import {AlertController, Events, IonicPage, ModalController, NavController} from 'ionic-angular';
import {Notification} from "../../models/notification/notification.interface";
import {NotificationService} from "../../providers/notitfication/notification.service";
import {SharedService} from "../../providers/shared/shared.service";
import {CommunityService} from "../../providers/community-service/community.service";
import {UserService} from "../../providers/user-service/user.service";
import {Community} from "../../models/community/community.interface";

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage implements OnInit {

  constructor(private navCtrl: NavController,
              private events: Events,
              public notificationService: NotificationService,
              private sharedService: SharedService,
              private communityService: CommunityService,
              private userService: UserService,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
  }

  ngOnInit(): void {
    this.notificationService.notifications.reverse();
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

  deleteAllActivityPopup() {
    let alert = this.alertCtrl.create({
      title: 'Delete all notifications',
      message: `Are you sure you want to delete all your Notifications?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.debug('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: data => {
            this.deleteAllNotification();
          }
        }
      ]
    });
    alert.present();
  }


  deleteAllNotification() {
    this.notificationService.deleteAllNotification(this.userService.thisProfile.keyForFirebase)
      .subscribe(data => {
        if (data == true) {
          this.notificationService.notifications.splice(0, this.notificationService.notifications.length);
          this.sharedService.createToast(`All notifications deleted successfully..`);
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
