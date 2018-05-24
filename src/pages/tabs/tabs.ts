import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Events, IonicPage} from 'ionic-angular';
import {NotificationService} from "../../providers/notitfication/notification.service";
import {SharedService} from "../../providers/shared/shared.service";
import {Notification} from "../../models/notification/notification.interface";
import {UserService} from "../../providers/user-service/user.service";
import {LiveActivityPage} from "../live-activity/live-activity";

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage implements OnInit, OnDestroy {

  tab1Root: string;
  tab2Root: string;
  tab3Root: string;
  tab4Root: string;
  newMessage: number = 0;

  @ViewChild('tabs') tabs;

  constructor(private notificationService: NotificationService,
              private events: Events,
              private sharedService: SharedService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.tab1Root = 'CommunitiesPage';
    this.tab2Root = 'NotificationPage';
    this.tab3Root = 'LiveActivityPage';
    this.tab4Root = 'MenuPage';
    this.eventsSubscribe();

    this.getNotification();
  }

  eventsSubscribe() {
    this.events.subscribe('newNotification', (data) => {

      if (this.tabs._selectHistory[this.tabs._selectHistory.length - 1] !== 't0-1') {
        this.newMessage = data;
      } else {
        this.clearNumbers();
        this.sharedService.createToast(`You got new notification`)
      }
    });

    this.events.subscribe('enterToNotificationPage', (data) => {

      data ? this.clearNumbers() : '';

    });

  }

  getNotification() {
    this.notificationService.getUserNotifications(this.userService.thisAuthenticatedUser.uid)
      .subscribe((notification) => {
          if (notification) {
            this.notificationService.notifications = <Notification[]>notification;
            this.notificationService.notifications.map((element) => {
              if (element.status !== 'done') {
                this.notificationService.notificationNumber++;
              }
              this.newMessage = this.notificationService.notificationNumber;
            })
          }
        }, (err) => {
          console.log(`Failed to get user notifications ${err.message}`)
        },
        () => {
          //done
        })
  }

  clearNumbers() {
    this.notificationService.notificationNumber = 0;
    this.newMessage = this.notificationService.notificationNumber;
  }

  ngOnDestroy() {

  }
}
