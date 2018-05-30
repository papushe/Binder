import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {UserService} from "../../providers/user-service/user.service";

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {

  constructor(private navCtrl: NavController,
              public userService: UserService) {
  }

  chatWith(chat) {
    this.navCtrl.push('ChatRoomPage', {chat: chat});
  }
}
