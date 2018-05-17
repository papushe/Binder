import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class ChatService {

  // baseUrl: string = 'https://appbinder.herokuapp.com';
  baseUrl: string = 'http://localhost:4300';
  context: string = 'message';
  roomNumberChat = [];

  constructor(private _http: HttpClient) {
    console.log('Hello ChatService Provider');
  }


  saveChat(chatRoomId, talkedTo, user) {
    const obj = {
      chatRoomId: chatRoomId,
      talkedToId: talkedTo.keyForFirebase || talkedTo.id,
      talkedToName: talkedTo.fullName,
      talkedFromName: user.fullName,
      profilePic: talkedTo.profilePic,
      userId: user.keyForFirebase
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/save-chat-room`, obj);
  }
}
