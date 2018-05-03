import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
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
  tab2Params: any;
  newMessage: number = 0;
  tabsSocketConnection: any;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private socketService: SocketService,
              private notificationsService: NotificationService,
              private events: Events) {


    this.tab1Root = 'CommunitiesPage';
    this.tab2Root = 'NotificationPage';
    this.tab3Root = 'ProfilePage';

  }

  ngOnInit(): void {
    this.tabsSocketConnection = this.socketService.enterToChatRoomPrivate()
      .subscribe(message => {
        this.newMessage++;
        this.tab2Params = {message: message};
        // this.notificationsService.createNotification(<Notification>message);
      });

    this.events.subscribe('enterToNotificationPage', (data) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      data ? this.newMessage = 0 : '';
    });

  }

  ngOnDestroy() {
    this.tabsSocketConnection.unsubscribe();
  }
}
