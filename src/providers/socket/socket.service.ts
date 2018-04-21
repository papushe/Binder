import {Injectable} from '@angular/core';
import {Socket} from "ng-socket-io";
import {UserService} from "../user-service/user.service";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";

@Injectable()
export class SocketService {


  isUserConnected: boolean = false;
  socketCommunityObserv: Subscription;

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

  joinCommunity(communityId) {
    let params = {
      room: communityId._id,
      roomName: communityId.communityName
    };
    this.socket.emit('join-community', params)
  }

  leftCommunity(communityId) {
    let params = {
      room: communityId._id,
      roomName: communityId.communityName
    };
    this.socket.emit('left-community', params)
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
