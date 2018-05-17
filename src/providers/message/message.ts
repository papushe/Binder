import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class MessageService {

  // baseUrl: string = 'https://appbinder.herokuapp.com';
  baseUrl: string = 'http://localhost:4300';
  context: string = 'message';

  constructor(public _http: HttpClient) {
  }

  getRoomMessages(roomId: string) {
    return this._http
      .get(`${this.baseUrl}/${this.context}/get/${roomId}`)
  }

}
