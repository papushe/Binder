import {Injectable} from '@angular/core';
import {Socket} from "ng-socket-io";
import {UserService} from "../user-service/user.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class SocketService {

  isUserConnected: boolean = false;

  constructor(private socket: Socket,
              private userService: UserService) {

  }

  socketConnect() {
    if (!this.isUserConnected) {
      this.isUserConnected = true;
      this.socket.connect();
      this.socket.emit('init-binder-socket', this.userService.thisProfile);
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

  joinToCommunityByManager(community, user, fromUser) {
    let params = {
      room: community._id,
      roomName: community.communityName,
      roomId: community._id,
      user: user,
      fromUserId: fromUser.keyForFirebase,
      from: fromUser
    };
    this.socket.emit('add-to-community-by-manager', params)
  }

  deleteFromCommunity(community, user, fromUser) {
    let params = {
      room: community._id,
      roomName: community.communityName,
      roomId: community._id,
      user: user,
      fromUserId: fromUser.keyForFirebase,
      from: fromUser
    };
    this.socket.emit('delete-from-community', params)
  }

  communityChangeActivity(activity, communityId, event, from) {
    let params = {
      activity: activity,
      communityId: communityId,
      room: communityId,
      event: event,
      from: from
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

  deleteCommunity(fromUser, community) {
    let params = {
      from: fromUser,
      community: community
    };

    this.socket.emit('delete-community', params);
  }

  claimedActivity(from, activity, community) {
    let params = {
      from: from,
      activity: activity,
      to: activity.consumer,
      community: community
    };

    this.socket.emit('claimed-activity', params);
  }

  declineActivity(from, activity, community) {
    let params = {
      from: from,
      activity: activity,
      to: activity.consumer,
      community: community
    };

    this.socket.emit('decline-activity', params);
  }

  approveActivity(from, activity, community) {
    let params = {
      from: from,
      activity: activity,
      to: activity.status,
      community: community
    };

    this.socket.emit('approve-activity', params);
  }

  onApproveActivity() {
    let observable = new Observable(observer => {
      this.socket.on('on-approve-activity', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  onNewNotification() {
    let observable = new Observable(observer => {
      this.socket.on('notification', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  onApproveActivityPrivate() {
    let observable = new Observable(observer => {
      this.socket.on('on-approve-activity-private', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  onClaimedActivity() {
    let observable = new Observable(observer => {
      this.socket.on('on-claimed-activity', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  onDeclineActivity() {
    let observable = new Observable(observer => {
      this.socket.on('on-decline-activity', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  onClaimedActivityPrivate() {
    let observable = new Observable(observer => {
      this.socket.on('on-claimed-activity-private', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  onDeleteCommunity() {
    let observable = new Observable(observer => {
      this.socket.on('on-delete-community', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  onUserAskToJoinPrivateRoom() {
    let observable = new Observable(observer => {
      this.socket.on('user-ask-to-join-private-room', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  onGetMembersChangedEvents() {
    let observable = new Observable(observer => {
      this.socket.on('members-changed', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  onGetMembersChangedEventsPrivate() {
    let observable = new Observable(observer => {
      this.socket.on('members-changed-private', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  onCommunityChangeActivity() {
    let observable = new Observable(observer => {
      this.socket.on('activities-change', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  onEnterToChatRoomPrivate() {
    let observable = new Observable(observer => {
      this.socket.on('chat-room', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  onJoinedLeaveFromChatRoomPrivate() {
    let observable = new Observable(observer => {
      this.socket.on('change-event-chat-room', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  onGetMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  onDisconnect() {
    this.socket.disconnect();
  }

}
