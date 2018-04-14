import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Socket} from "ng-socket-io";
import {UserService} from "../user-service/user.service";
import {Observable} from "rxjs/Observable";
import {ToastController} from "ionic-angular";

@Injectable()
export class SocketService {


  isUserConnected: boolean = false;

  constructor(public http: HttpClient,
              private socket: Socket,
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
    // this.navCtrl.push('ChatRoomPage', {nickname: this.nickname});

  }

  getUsers() {
    let observable = new Observable(observer => {
      this.socket.on('users-changed', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  communityChat(communityName) {
    let params = {
      room: communityName
    };
    this.socket.emit('join', params, () => {
      console.log(`User has joined ${communityName} group`)
    });
  }

  communityNewActivity(activity, communityId) {
    this.socket.emit('add-activity', {
      activity: activity,
      communityId: communityId
    });
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
