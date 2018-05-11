import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

/*
  Generated class for the ChatService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatService {

  // baseUrl: string = 'https://appbinder.herokuapp.com';
  baseUrl: string = 'http://localhost:4300';
  context: string = 'message';
  roomNumberChat = [];

  constructor(public _http: HttpClient) {
    console.log('Hello ChatService Provider');
  }


  saveChat(chatRoomId, talkedTo, user) {
    const obj = {
      chatRoomId: chatRoomId,
      talkedToId: talkedTo.keyForFirebase,
      talkedToName: talkedTo.fullName,
      talkedFromName: user.fullName,
      profilePic: talkedTo.profilePic,
      userId: user.keyForFirebase
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/save-chat-room`, obj);
  }
}
