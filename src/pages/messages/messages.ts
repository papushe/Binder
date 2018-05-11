import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ChatService} from "../../providers/chat-service/chat-service";
import {UserService} from "../../providers/user-service/user.service";
import {ChatRoomPage} from "../chat-room/chat-room";

/**
 * Generated class for the MessagesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {
  roomNumberChat = [];

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private chatService: ChatService,
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
