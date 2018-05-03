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
  nickname = '';
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
    if (this.userToTalk) {
      this.nickname = this.userToTalk.firstName + ' ' + this.userToTalk.lastName;
    } else {
      this.nickname = this.paramsFromUserToTalk.from;
    }


    this.messageSocketConnection = this.socketService.getMessages().subscribe(message => {
      this.messages.push(message);
    });

    this.joinLeaveSocketConnection = this.socketService.joinedLeaveFromChatRoomPrivate().subscribe(message => {
      this.handleJoinToRoom(message);
    });


    if (this.paramsFromUserToTalk) {

      this.joinToChatRoom(this.paramsFromUserToTalk.room, this.paramsFromUserToTalk.from);

    } else {
      this.enterToChatRoomSocketConnection = this.socketService.enterToChatRoomPrivate().subscribe(message => {
        console.log(message)
        // this.handleJoinToRoom(message);
      });

      this.enterToChatRoom(this.randomNumberRoom);

    }
  }

  handleJoinToRoom(message) {
    this.randomNumberRoom = message.room;
    if (message.event == 'joined') {

      this.sharedService.createToast(`${message.from} joined to chat room`);

    } else if (message.event == 'left') {

      this.sharedService.createToast(`${message.from} left to chat room`);

    }
  }

  enterToChatRoom(roomNumber) {
    this.socketService.enterToChatRoom(roomNumber, this.nickname)
  }

  joinToChatRoom(roomNumber, talkTo) {
    this.socketService.joinToChatRoom(roomNumber, talkTo)
  }

  leftFromChatRoom(roomNumber, talkTo) {
    this.socketService.leaveFromChatRoom(roomNumber, talkTo)
  }

  sendMessage() {
    this.socket.emit('add-message', {text: this.message});
    this.message = '';
  }


  saveChat() {
    // this.chatService.saveChat()
  }

  ionViewWillLeave() {

    this.joinLeaveSocketConnection.unsubscribe();
    this.messageSocketConnection.unsubscribe();
    this.enterToChatRoomSocketConnection ? this.enterToChatRoomSocketConnection.unsubscribe() : '';
    this.leftFromChatRoom(this.randomNumberRoom, this.nickname)
  }

}
