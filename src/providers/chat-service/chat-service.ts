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


  constructor(public _http: HttpClient) {
    console.log('Hello ChatService Provider');
  }

  saveChat(chatRoomName, massage) {
    const obj = {
      massage: massage
    };
    return this._http
      .post(`${this.baseUrl}/${chatRoomName}`, obj);
  }


}
