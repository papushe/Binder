import {Injectable} from '@angular/core';
import {Socket} from "ng-socket-io";
import {UserService} from "../user-service/user.service";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";

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

      this.getUsers().subscribe(data => {
        console.log(data);
      });
    }
  }

  getUsers() {
    let observable = new Observable(observer => {
      this.socket.on('users-changed', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  enteredToCommunity(community) {
    let params = {
      room: community._id,
      roomName: community.communityName
    };
    this.socket.emit('join-community', params)
  }

  leftCommunity(community) {
    let params = {
      room: community._id,
      roomName: community.communityName
    };
    this.socket.emit('left-community', params)
  }


  joinToCommunity(community, user) {
    let params = {
      room: community._id,
      roomName: community.communityName,
      roomId:community._id,
      user: user
    };
    this.socket.emit('add-to-community', params)
  }

  deleteFromCommunity(community, user) {
    let params = {
      room: community._id,
      roomName: community.communityName,
      roomId:community._id,
      user: user
    };
    this.socket.emit('delete-from-community', params)
  }

  getMembersChangedEvents() {
    let observable = new Observable(observer => {
      this.socket.on('members-changed', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }


  communityNewActivity(activity, communityId) {
    this.socket.emit('add-activity', {
      activity: activity,
      communityId: communityId,
      room: communityId
    });
  }

  getCommunityNewActivity() {
    let thisUserName = this.userService.thisProfile.firstName + ' ' + this.userService.thisProfile.lastName;
    let observable = new Observable(observer => {
      this.socket.on('new-add-activity', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  disconnect() {
    this.socket.disconnect();
  }

}
