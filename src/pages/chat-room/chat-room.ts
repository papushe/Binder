import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Socket} from 'ng-socket-io';
import {Profile} from "../../models/profile/profile.interface";
import {SocketService} from "../../providers/socket/socket.service";
import {UserService} from "../../providers/user-service/user.service";
import {SharedService} from "../../providers/shared/shared.service";
import {ChatService} from "../../providers/chat-service/chat-service";
import {MessageService} from "../../providers/message/message";

@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chat-room.html',
})
export class ChatRoomPage implements OnInit {

  messages = [];
  message = '';
  userToTalk: any;
  currentUser: Profile;
  paramsFromUserToTalk: any;
  randomNumberRoom = this.sharedService.getRandomString(10);
  messageSocketConnection: any;
  joinLeaveSocketConnection: any;
  enterToChatRoomSocketConnection: any;
  chatWith: any;
  chatIsSaved: boolean = false;
  alreadyChat: any;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private socket: Socket,
              private socketService: SocketService,
              private userService: UserService,
              private sharedService: SharedService,
              private chatService: ChatService,
              private messagesService: MessageService) {
  }

  ngOnInit() {
    this.paramsFromUserToTalk = this.navParams.get('message');
    this.currentUser = this.userService.thisProfile;
    this.userToTalk = this.navParams.get('member');
    if (this.userToTalk && this.userToTalk.chats.length > 0) {
      this.checkIfAlreadyChat();
    }
    if (!this.userToTalk && this.paramsFromUserToTalk) {
      this.getMessages(this.paramsFromUserToTalk, true);
    }
    this.chatWith = this.navParams.get('chat');
    if (this.chatWith || this.alreadyChat) {
      this.getMessages(this.chatWith || this.alreadyChat, '')
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

    } else if (message.event == 'enter-to-chat-room') {

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
    this.socketService.sendMessage(this.message, this.randomNumberRoom, this.userToTalk, this.userService.thisProfile);
    this.message = '';
  }


  checkIfAlreadyChat() {
    this.userToTalk.chats.find((chat) => {
      if (chat.talkedFromName === this.userToTalk.fullName) {
        this.alreadyChat = chat;
      }
    })
  }

  saveChat() {

    this.chatService.saveChat(this.randomNumberRoom, this.userToTalk, this.userService.thisProfile)
      .subscribe(data => {
        this.userService.thisProfile = <Profile>data;
        this.chatService.roomNumberChat = this.userService.thisProfile.chats;
      }, (err) => {
        console.log(err)
      }, () => {
        console.log('done')
      })
  }

  getMessages(chat, message) {
    let fullName = '',
      room = '';
    if (message) {
      this.userToTalk = chat.from;
      room = chat.room;
    } else {
      if (this.currentUser.fullName == chat.talkedToName) {
        fullName = chat.talkedFromName
      } else {
        fullName = chat.talkedToName
      }
      this.userToTalk = {
        id: chat.talkedToId,
        fullName: fullName,
        profilePic: chat.talkedToPic || chat.profilePic
      };
      room = chat.chatRoomId;
    }

    this.randomNumberRoom = room;
    this.chatIsSaved = true;

    this.messagesService.getRoomMessages(this.randomNumberRoom)
      .subscribe(messages => {
        this.messages = <any[]>messages;
      }, err => {
        console.log(err)
      }, () => {
        console.log('done')
      })
  }

  ionViewWillLeave() {
    if (!this.chatIsSaved) {
      this.saveChat();
    }
    this.joinLeaveSocketConnection.unsubscribe();
    this.messageSocketConnection.unsubscribe();
    this.enterToChatRoomSocketConnection ? this.enterToChatRoomSocketConnection.unsubscribe() : '';
    this.leftFromChatRoom(this.randomNumberRoom, this.userToTalk, this.currentUser)

  }

}
