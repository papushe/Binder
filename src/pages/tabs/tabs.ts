import {Component, OnInit, ViewChild} from '@angular/core';
import {Events, IonicPage} from 'ionic-angular';
import {NotificationService} from "../../providers/notitfication/notification.service";
import {Notification} from "../../models/notification/notification.interface";
import {UserService} from "../../providers/user-service/user.service";
import {CalendarService} from "../../providers/calendar-service/calendar-service";
import {ActivityService} from "../../providers/activity-service/activity-service";

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage implements OnInit {

  tab1Root: string;
  tab2Root: string;
  tab3Root: string;
  tab4Root: string;

  @ViewChild('tabs') tabs;

  constructor(private notificationService: NotificationService,
              private events: Events,
              public userService: UserService,
              private calenderService: CalendarService,
              public activityService: ActivityService) {
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
        this.notificationService.notificationNumber = data;
      } else {
        this.clearNumbers();
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
              if ((element.event === 'user-approve-activity' ||
                element.event === 'you-approved-activity') && !element.isAddToCalender) {
                element.isAddToCalender = true;
                let notification = <any>element;

                this.calenderService.createEvent(notification.activity);

                this.updateNotification(element, 'tabsPage');

              }


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
  }

  updateNotification(params, from) {
    this.notificationService.updateUserNotification(params, from)
      .subscribe(data => {
        console.log(data);
      }, err => {
        console.log(`Faild to save notification, ${err}`)
      }, () => {
        //done
      });
  }


}
