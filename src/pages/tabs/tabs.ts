import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Events, IonicPage, NavController, NavParams, Tab} from 'ionic-angular';
import {SocketService} from "../../providers/socket/socket.service";
import {NotificationService} from "../../providers/notitfication/notification";
import {Notification} from "../../models/notification/notification.interface";

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage implements OnInit, OnDestroy {

  tab1Root: string;
  tab2Root: string;
  tab3Root: string;
  newMessage: number = 0;
  tabsSocketConnection: any;
  @ViewChild('tabs') tabs;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private socketService: SocketService,
              private notificationService: NotificationService,
              private events: Events) {

    this.tab1Root = 'CommunitiesPage';
    this.tab2Root = 'NotificationPage';
    this.tab3Root = 'ProfilePage';

  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.tabsSocketConnection = this.socketService.enterToChatRoomPrivate()
      .subscribe(message => {

        if (this.tabs._selectHistory[this.tabs._selectHistory.length - 1] !== 't0-1') {
          this.newMessage++;
        }
        this.notificationService.createNotification(<Notification>message)
          .subscribe(data => {
            this.notificationService.notifications.push(<Notification>data);
          }, err => {
            console.log(`Faild to save notification, ${err}`)
          }, () => {
            //done
          })
      });

    this.events.subscribe('enterToNotificationPage', (data) => {
      data ? this.newMessage = 0 : '';
    });

  }

  ngOnDestroy() {
    this.tabsSocketConnection.unsubscribe();
  }
}
