import {Injectable} from '@angular/core';
import {Socket} from "ng-socket-io";
import {UserService} from "../user-service/user.service";
import {Observable} from "rxjs/Observable";
import {SharedService} from "../shared/shared.service";

@Injectable()
export class SocketService {


  isUserConnected: boolean = false;
  static roomNumber = 0;

  constructor(private socket: Socket,
              private userService: UserService,
              private sharedService: SharedService) {

  }

  socketConnect() {
    if (!this.isUserConnected) {
      const userName = this.userService.thisProfile.firstName + ' ' + this.userService.thisProfile.lastName;
      this.socket.connect();
      this.isUserConnected = true;
      this.socket.emit('set-nickname', userName);

      this.getNewSockets().subscribe(data => {
        console.log(data);
      });
    }
  }

  //emits
  enteredToCommunity(community) {
    let params = {
      room: community._id,
      roomName: community.communityName,
      roomId: community._id,
    };
    this.socket.emit('entered-to-community', params)
  }

  leftCommunity(community) {
    let params = {
      room: community._id,
      roomName: community.communityName,
      roomId: community._id,
    };
    this.socket.emit('left-community', params)
  }

  joinToCommunity(community, user) {
    let params = {
      room: community._id,
      roomName: community.communityName,
      roomId: community._id,
      user: user
    };
    this.socket.emit('join-to-community', params)
  }

  joinToCommunityByManager(community, user) {
    let params = {
      room: community._id,
      roomName: community.communityName,
      roomId: community._id,
      user: user
    };
    this.socket.emit('add-to-community-by-manager', params)
  }

  deleteFromCommunity(community, user) {
    let params = {
      room: community._id,
      roomName: community.communityName,
      roomId: community._id,
      user: user
    };
    this.socket.emit('delete-from-community', params)
  }

  communityNewActivity(activity, communityId) {
    let params = {
      activity: activity,
      communityId: communityId,
      room: communityId
    };
    this.socket.emit('add-activity', params);
  }

  enterToChatRoom(roomNum, userToTalk) {
    let params = {
      room: roomNum,
      to: userToTalk
    };
    this.socket.emit('enter-to-chat-room', params);
  }

  joinToChatRoom(roomNum, talkto) {
    let params = {
      room: roomNum,
      to: talkto
    };
    this.socket.emit('join-to-chat-room', params);
  }

  leaveFromChatRoom(roomNum, talkto) {
    let params = {
      room: roomNum,
      to: talkto
    };
    this.socket.emit('left-from-chat-room', params);
  }


  //observable
  getNewSockets() {
    let observable = new Observable(observer => {
      this.socket.on('users-changed', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getMembersChangedEvents() {
    let observable = new Observable(observer => {
      this.socket.on('members-changed', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getMembersChangedEventsPrivate() {
    let observable = new Observable(observer => {
      this.socket.on('members-changed-private', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getCommunityNewActivity() {
    let observable = new Observable(observer => {
      this.socket.on('new-add-activity', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  enterToChatRoomPrivate() {
    let observable = new Observable(observer => {
      this.socket.on('chat-room', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  joinedLeaveFromChatRoomPrivate() {
    let observable = new Observable(observer => {
      this.socket.on('change-event-chat-room', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  disconnect() {
    this.socket.disconnect();
  }

}
