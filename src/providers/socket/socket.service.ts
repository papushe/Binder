import {Injectable} from '@angular/core';
import {Socket} from "ng-socket-io";
import {UserService} from "../user-service/user.service";
import {Observable} from "rxjs/Observable";
import {ToastController} from "ionic-angular";

@Injectable()
export class SocketService {


  isUserConnected: boolean = false;

  constructor(private socket: Socket,
              private userService: UserService,
              private toastCtrl: ToastController) {

  }


  socketConnect() {
    if (!this.isUserConnected) {
      const userName = this.userService.thisProfile.firstName + ' ' + this.userService.thisProfile.lastName;
      this.socket.connect();
      this.isUserConnected = true;
      this.socket.emit('set-nickname', userName);

      this.getUsers().subscribe(data => {
        let user = data['user'];
        if (data['event'] === 'left') {
          this.showToast('User left: ' + user);
        } else {
          this.showToast('User joined: ' + user);
        }
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

  communityChat(communityId) {
    let params = {
      room: communityId
    };
    this.socket.emit('join', params, () => {
      console.log(`User has joined ${communityId} group`)
    });
  }

  communityNewActivity(activity, communityId) {
    this.socket.emit('add-activity', {
      activity: activity,
      communityId: communityId,
      room: communityId
    });
  }

  getCommunityNewActivity() {
    let observable = new Observable(observer => {
      this.socket.on('new-add-activity', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }


  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
