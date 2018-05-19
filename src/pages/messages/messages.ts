import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {UserService} from "../../providers/user-service/user.service";

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {
  roomNumberChat = [];

  constructor(private navCtrl: NavController,
              private userService: UserService) {
  }

  ionViewDidLoad() {
    this.roomNumberChat = this.userService.thisProfile.chats;
    console.log('ionViewDidLoad MessagesPage');
  }

  chatWith(chat) {
    this.navCtrl.push('ChatRoomPage', {chat: chat});
  }


}
