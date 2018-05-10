import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Events, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {UserService} from "../providers/user-service/user.service";
import {LoginPage} from "../pages/login/login";
import {SharedService} from "../providers/shared/shared.service";
import {SocketService} from "../providers/socket/socket.service";
import {Notification} from "../models/notification/notification.interface";
import {NotificationService} from "../providers/notitfication/notification.service";


@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit, OnDestroy {

  rootPage: string;
  tabsSocketConnection: any;
  @ViewChild('child') child;

  constructor(private userService: UserService,
              private sharedService: SharedService,
              platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private socketService: SocketService,
              private notificationService: NotificationService,
              private events: Events) {

    this.userService.thisAuthenticatedUser$ = this.userService.getAuthenticatedUser().subscribe(auth => {
      if (!auth) {
        this.rootPage = 'LoginPage';
      }
      else {
        this.userService.thisAuthenticatedUser = auth;
        auth.getIdToken(true)
          .then(token => {
            this.sharedService.storeToken(token);
            this.rootPage = 'TabsPage';
          })
          .catch(err => {
            console.log(`Initialization error: ${err.message}`);
            this.rootPage = 'LoginPage';
          });
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnInit(): void {
    this.init();
    console.log(this.child);
  }

  init() {
    this.tabsSocketConnection = this.socketService.enterToChatRoomPrivate()
      .subscribe(message => {

        this.notificationService.notificationNumber++;

        this.events.publish('newNotification', this.notificationService.notificationNumber);

        this.notificationService.createNotification(<Notification>message)
          .subscribe(data => {
            this.notificationService.notifications.push(<Notification>data);
          }, err => {
            console.log(`Failed to save notification, ${err}`)
          }, () => {
            //done
          })
      });
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }
}

