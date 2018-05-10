import {Injectable} from '@angular/core';
import {Socket} from "ng-socket-io";
import {UserService} from "../user-service/user.service";
import {Observable} from "rxjs/Observable";
import {SharedService} from "../shared/shared.service";

@Injectable()
export class SocketService {


  isUserConnected: boolean = false;

  constructor(private socket: Socket,
              private userService: UserService) {

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

  joinToCommunityByManager(community, user, fromUserId) {
    let params = {
      room: community._id,
      roomName: community.communityName,
      roomId: community._id,
      user: user,
      fromUserId: fromUserId
    };
    this.socket.emit('add-to-community-by-manager', params)
  }

  deleteFromCommunity(community, user, fromUserId) {
    let params = {
      room: community._id,
      roomName: community.communityName,
      roomId: community._id,
      user: user,
      fromUserId: fromUserId
    };
    this.socket.emit('delete-from-community', params)
  }

  communityChangeActivity(activity, communityId, event) {
    let params = {
      activity: activity,
      communityId: communityId,
      room: communityId,
      event: event
    };
    this.socket.emit('activities-change', params);
  }

  sendMessage(message, room, userToTalk, from) {
    let params = {
      message: message,
      room: room,
      to: userToTalk,
      from: from
    };
    this.socket.emit('add-message', params);
  }

  enterToChatRoom(roomNum, userToTalk, from) {
    let params = {
      room: roomNum,
      user: userToTalk,
      from: from,
      fromUserId: from.keyForFirebase
    };
    this.socket.emit('enter-to-chat-room', params);
  }

  joinToChatRoom(roomNum, userToTalk, from) {
    let params = {
      room: roomNum,
      user: userToTalk,
      from: from,
      fromUserId: from.keyForFirebase
    };
    this.socket.emit('join-to-chat-room', params);
  }

  leaveFromChatRoom(roomNum, userToTalk, from) {
    let params = {
      room: roomNum,
      user: userToTalk,
      from: from
    };
    this.socket.emit('left-from-chat-room', params);
  }

  askToJoinToPrivateRoom(fromUser, community) {
    let params = {
      user: community,
      from: fromUser
    };

    this.socket.emit('ask-to-join-private-room', params);
  }

  declineUserJoinPrivateRoom(fromUser, communityName, to) {
    let params = {
      from: fromUser,
      communityName: communityName,
      to: to
    };

    this.socket.emit('decline-user-join-private-room', params);
  }


  //observable
  userAskToJoinPrivateRoom() {
    let observable = new Observable(observer => {
      this.socket.on('user-ask-to-join-private-room', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

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

  getCommunityChangeActivity() {
    let observable = new Observable(observer => {
      this.socket.on('activities-change', (data) => {
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
