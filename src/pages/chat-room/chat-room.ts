import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Socket} from 'ng-socket-io';
import {Profile} from "../../models/profile/profile.interface";
import {SocketService} from "../../providers/socket/socket.service";
import {UserService} from "../../providers/user-service/user.service";
import {SharedService} from "../../providers/shared/shared.service";

@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chat-room.html',
})
export class ChatRoomPage implements OnInit {

  messages = [];
  message = '';
  userToTalk: Profile;
  currentUser: Profile;
  paramsFromUserToTalk: any;
  randomNumberRoom = this.sharedService.getRandomString(10);
  messageSocketConnection: any;
  joinLeaveSocketConnection: any;
  enterToChatRoomSocketConnection: any;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private socket: Socket,
              private socketService: SocketService,
              private userService: UserService,
              private sharedService: SharedService) {
  }

  ngOnInit() {
    this.paramsFromUserToTalk = this.navParams.get('message');

    this.currentUser = this.userService.thisProfile;
    this.userToTalk = this.navParams.get('member');
    if (!this.userToTalk) {
      this.userToTalk = this.paramsFromUserToTalk.from;
    }

    this.messageSocketConnection = this.socketService.getMessages().subscribe(message => {
      this.messages.push(message);
    });

    this.joinLeaveSocketConnection = this.socketService.joinedLeaveFromChatRoomPrivate().subscribe(message => {
      this.handleJoinToRoom(message);
    });

    if (this.paramsFromUserToTalk) {
      this.randomNumberRoom = this.paramsFromUserToTalk.room;
      this.joinToChatRoom(this.paramsFromUserToTalk.room, this.userToTalk, this.currentUser);

    } else {
      this.enterToChatRoomSocketConnection = this.socketService.enterToChatRoomPrivate().subscribe(message => {
        console.log(message)

      });

      this.enterToChatRoom(this.randomNumberRoom, this.userToTalk, this.currentUser);

    }
  }

  handleJoinToRoom(message) {
    this.randomNumberRoom = message.room;
    if (message.event == 'joined') {

      this.sharedService.createToast(`${message.from.fullName} joined to chat room`);

    } else if (message.event == 'left') {

      this.sharedService.createToast(`${message.from.fullName} left from chat room`);

    }
  }

  enterToChatRoom(roomNumber, userTalkTo, from) {
    this.socketService.enterToChatRoom(roomNumber, userTalkTo, from)
  }

  joinToChatRoom(roomNumber, userTalkTo, from) {
    this.socketService.joinToChatRoom(roomNumber, userTalkTo, from)
  }

  leftFromChatRoom(roomNumber, userTalkTo, from) {
    this.socketService.leaveFromChatRoom(roomNumber, userTalkTo, from)
  }

  sendMessage() {
    // this.socketService.sendMessage(this.message, this.randomNumberRoom, this.userToTalk);
    this.message = '';
  }


  saveChat() {
    // this.chatService.saveChat()
  }

  ionViewWillLeave() {

    this.joinLeaveSocketConnection.unsubscribe();
    this.messageSocketConnection.unsubscribe();
    this.enterToChatRoomSocketConnection ? this.enterToChatRoomSocketConnection.unsubscribe() : '';
    this.leftFromChatRoom(this.randomNumberRoom, this.userToTalk, this.currentUser)

  }

}
