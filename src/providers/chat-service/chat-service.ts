import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {SharedService} from "../shared/shared.service";

@Injectable()
export class ChatService {

  baseUrl: string = '';
  context: string = 'message';
  roomNumberChat = [];

  constructor(private _http: HttpClient,
              private sharedService: SharedService) {
    this.baseUrl = this.sharedService.baseUrl;
  }


  saveChat(chatRoomId, talkedTo, user) {
    const obj = {
      chatRoomId: chatRoomId,
      talkedToId: talkedTo.keyForFirebase || talkedTo.keyForFirebase,
      talkedToName: talkedTo.fullName,
      talkedFromName: user.fullName,
      profilePic: talkedTo.profilePic,
      userId: user.keyForFirebase
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/save-chat-room`, obj);
  }
}
