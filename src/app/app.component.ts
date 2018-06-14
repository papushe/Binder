import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Events, NavController, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {UserService} from "../providers/user-service/user.service";
import {SharedService} from "../providers/shared/shared.service";
import {SocketService} from "../providers/socket/socket.service";
import {Notification} from "../models/notification/notification.interface";
import {NotificationService} from "../providers/notitfication/notification.service";
import {ActivityService} from "../providers/activity-service/activity-service";
import {CalendarService} from "../providers/calendar-service/calendar-service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit, OnDestroy {

  @ViewChild('myNav') navCtrl: NavController;

  rootPage: string;
  tabsSocketEnterToChatRoomPrivate: any;
  tabsSocketClaimedActivityPrivateRoom: any;
  tabsSocketApproveActivityPrivateRoom: any;
  tabsSocketNewNotification: any;
  socketUsersChanged: any;
  @ViewChild('child') child;

  constructor(private userService: UserService,
              private sharedService: SharedService,
              private platform: Platform,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private socketService: SocketService,
              private notificationService: NotificationService,
              private events: Events,
              private activityService: ActivityService,
              private  calendarService: CalendarService) {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit(): void {
    this.init();
  }

  init() {

    this.authenticatedUser();

    this.privateChatRoom();

    this.claimedActivityPrivate();

    this.approveActivityPrivate();

    this.newNotification();

    this.userChanged();

  }


  authenticatedUser() {
    this.userService.thisAuthenticatedUser$ = this.userService.getAuthenticatedUser().subscribe(auth => {
      if (!auth) {
        this.rootPage = 'LoginPage';
      }
      else {
        this.userService.thisAuthenticatedUser = auth;
        auth.getIdToken(true)
          .then(token => {
            this.sharedService.storeToken(token);
            this.getActivity();
            if (!this.navCtrl.getActive() || this.navCtrl.getActive().name !== 'TabsPage') {
              this.rootPage = 'TabsPage';
            }
          })
          .catch(err => {
            console.log(`Initialization error: ${err.message}`);
            this.rootPage = 'LoginPage';
          });
      }
    });
  }

  privateChatRoom() {
    this.tabsSocketEnterToChatRoomPrivate = this.socketService.onEnterToChatRoomPrivate()
      .subscribe(data => {

        this.notificationService.notificationNumber++;

        this.events.publish('newNotification', this.notificationService.notificationNumber);

        this.notificationService.createNotification(<Notification>data)
          .subscribe(data => {
            this.notificationService.notifications.push(<Notification>data);
          }, err => {
            console.log(`Failed to save notification, ${err}`)
          }, () => {
            //done
          })
      });
  }


  newNotification() {
    this.tabsSocketNewNotification = this.socketService.onNewNotification()
      .subscribe(data => {

        this.notificationService.notificationNumber++;

        this.events.publish('newNotification', this.notificationService.notificationNumber);

        let notification = <any>data;

        if (notification.event === 'user-approve-activity' ||
          notification.event === 'you-approved-activity' ||
          notification.event === 'activity-finish' ||
          notification.event === 'activity-canceled') {

          this.getActivity();

          if (!notification.isAddToCalender && notification.event !== 'activity-finish') {
            notification.isAddToCalender = true;

            this.calendarService.createEvent(notification.activity);
          }

        }

        this.notificationService.createNotification(<Notification>notification)
          .subscribe(data => {
            this.notificationService.notifications.push(<Notification>data);
          }, err => {
            console.log(`Failed to save notification, ${err}`)
          }, () => {
            //done
          })
      });
  }

  getActivity() {
    this.activityService.getActivities(this.userService.thisAuthenticatedUser);
  }

  claimedActivityPrivate() {
    this.tabsSocketClaimedActivityPrivateRoom = this.socketService.onClaimedActivityPrivate()
      .subscribe(data => {

        this.notificationService.notificationNumber++;

        this.events.publish('newNotification', this.notificationService.notificationNumber);


        let notification: any = data;

        notification.to = {
          keyForFirebase: notification.activity.consumer.id,
          fullName: notification.activity.consumer.name
        };


        this.notificationService.createNotification(<Notification>notification)
          .subscribe(data => {
            this.notificationService.notifications.push(<Notification>data);
          }, err => {
            console.log(`Failed to save notification, ${err}`)
          }, () => {
            //done
          })
      });
  }

  approveActivityPrivate() {
    this.tabsSocketApproveActivityPrivateRoom = this.socketService.onApproveActivityPrivate()
      .subscribe(data => {

        this.notificationService.notificationNumber++;

        this.events.publish('newNotification', this.notificationService.notificationNumber);


        let notification: any = data;

        notification.to = {
          keyForFirebase: notification.activity.consumer.id,
          fullName: notification.activity.consumer.name
        };


        this.notificationService.createNotification(<Notification>notification)
          .subscribe(data => {
            this.notificationService.notifications.push(<Notification>data);
          }, err => {
            console.log(`Failed to save notification, ${err}`)
          }, () => {
            //done
          })
      });
  }

  userChanged() {
    this.socketUsersChanged = this.socketService.onUserChanged()
      .subscribe(data => {
        let userChanged = <any>data;
        this.userService.onlineUsers = <any[]>userChanged.allUsersList;
      });
  }

  ngOnDestroy(): void {
    this.socketService.onDisconnect();
  }
}

