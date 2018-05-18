import {Component, OnInit, ViewChild} from '@angular/core';
import {Content, IonicPage, NavParams} from 'ionic-angular';
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

  @ViewChild(Content) content: Content;
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
  alreadyChat: any;

  constructor(private navParams: NavParams,
              private socketService: SocketService,
              private userService: UserService,
              private sharedService: SharedService,
              private chatService: ChatService,
              private messagesService: MessageService) {
  }

  ngOnInit() {
    this.init();

    this.handleSockets();

  }

  scrollToBottom(){
    this.content.scrollToBottom(0)
  }

  init() {
    this.currentUser = this.userService.thisProfile;
    this.paramsFromUserToTalk = this.navParams.get('message'); //from notification
    this.userToTalk = this.navParams.get('member'); //select from community
    this.chatWith = this.navParams.get('chat'); //from chats tab

    if (this.userToTalk) { //if userToTalk - check if chat with him
      this.checkIfAlreadyChat('enter');
    }

    if (this.paramsFromUserToTalk) { //from notification get messages
      this.userToTalk = this.paramsFromUserToTalk.from;
      this.checkIfAlreadyChat('join');
    }

    if (this.chatWith || this.alreadyChat) { //from already chats get messages
      this.getMessages(this.chatWith || this.alreadyChat)
    }
  }

  handleSockets() {
    this.messageSocketConnection = this.socketService.onGetMessages().subscribe(message => {
      this.messages.push(message);
    });

    this.joinLeaveSocketConnection = this.socketService.onJoinedLeaveFromChatRoomPrivate().subscribe(message => {
      this.handleJoinToRoom(message);
    });
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

  checkIfAlreadyChat(type) {
    if (type === 'enter') {
      if (this.currentUser.chats && this.currentUser.chats.length > 0) { // if this user and i have chat
        this.currentUser.chats.map((chat) => {
          if (chat.talkedToName === this.userToTalk.fullName || chat.talkedFromName === this.userToTalk.fullName) {
            this.alreadyChat = chat;
            this.enterToChatRoom(chat.chatRoomId, this.userToTalk, this.currentUser);
          }
        })
      } else {
        this.saveChat(this.randomNumberRoom, this.userToTalk); // else save chat
        this.enterToChatRoom(this.randomNumberRoom, this.userToTalk, this.currentUser);
      }
    } else {
      if (type === 'join') {
        if (this.currentUser.chats && this.currentUser.chats.length > 0) { // if this user and i have chat
          this.currentUser.chats.map((chat) => {
            if (chat.talkedToName === this.userToTalk.fullName || chat.talkedFromName === this.userToTalk.fullName) {
              this.alreadyChat = chat;
              this.joinToChatRoom(chat.chatRoomId, this.userToTalk, this.currentUser);
            }
          })
        } else {
          this.saveChat(this.paramsFromUserToTalk.room, this.paramsFromUserToTalk.from); // else save chat
          this.randomNumberRoom = this.paramsFromUserToTalk.room;
          this.userToTalk = this.paramsFromUserToTalk.from;
          this.getMessages('');
          this.joinToChatRoom(this.paramsFromUserToTalk.room, this.paramsFromUserToTalk.from, this.currentUser);
        }
      }
    }
  }

  saveChat(room, talkedTo) {

    this.chatService.saveChat(room, talkedTo, this.userService.thisProfile)
      .subscribe(data => {
        this.userService.thisProfile = <Profile>data;
        this.chatService.roomNumberChat = this.userService.thisProfile.chats;
      }, (err) => {
        console.log(err)
      }, () => {
        console.log('done')
      })
  }

  getMessages(chat) {
    if (chat) {
      let fullName = '',
        room = '';

      if (this.currentUser.fullName == chat.talkedToName) {
        fullName = chat.talkedFromName
      } else {
        fullName = chat.talkedToName
      }

      this.userToTalk = {
        keyForFirebase: chat.talkedToId,
        fullName: fullName,
        profilePic: chat.talkedToPic || chat.profilePic
      };
      room = chat.chatRoomId;

      this.randomNumberRoom = room;

      this.chatWith ? this.enterToChatRoom(this.randomNumberRoom, this.userToTalk, this.currentUser) : '';
    }

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
    this.joinLeaveSocketConnection.unsubscribe();
    this.messageSocketConnection.unsubscribe();
    this.enterToChatRoomSocketConnection ? this.enterToChatRoomSocketConnection.unsubscribe() : '';
    this.leftFromChatRoom(this.randomNumberRoom, this.userToTalk, this.currentUser)
  }

}
