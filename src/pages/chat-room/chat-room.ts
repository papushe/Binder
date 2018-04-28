import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Socket} from 'ng-socket-io';
import {Profile} from "../../models/profile/profile.interface";
import {SocketService} from "../../providers/socket/socket.service";
import {UserService} from "../../providers/user-service/user.service";
import {ChatService} from "../../providers/chat-service/chat-service";

@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chat-room.html',
})
export class ChatRoomPage implements OnInit {

  messages = [];
  nickname = '';
  message = '';
  userToTalk: Profile;
  currentUser: Profile;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private socket: Socket,
              private socketService: SocketService,
              private userService: UserService,
              private chatService: ChatService) {
  }

  ngOnInit() {

    this.currentUser = this.userService.thisProfile;
    this.userToTalk = this.navParams.get('member');
    this.nickname = this.userToTalk.firstName + ' ' + this.userToTalk.lastName;

    this.socketService.getMessages().subscribe(message => {
      this.messages.push(message);
    });

    this.socketService.enterToChatRoomPrivate().subscribe(message => {
      console.log(message)
    });

    this.enterToChatRoom();
  }

  enterToChatRoom() {
    this.socketService.enterToChatRoom(this.currentUser, this.nickname)
  }

  sendMessage() {
    this.socket.emit('add-message', {text: this.message});
    this.message = '';
  }


  saveChat() {
    // this.chatService.saveChat()
  }

  ionViewWillLeave() {
    this.socket.disconnect();
  }

}
