import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Message} from "../../models/messages/message.interface";

/*
  Generated class for the MessageService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageService {

  // baseUrl: string = 'https://appbinder.herokuapp.com';
  baseUrl:string = 'http://localhost:4300';
  context: string = 'message';

  constructor(public _http: HttpClient) {
  }

  createMessage(msg: Message) {
    const obj = {
      from: msg.from,
      to: msg.to,
      content: msg.content,
      room: msg.room,
      status: msg.status
    };
    return this._http
      .post(`${this.baseUrl}/${this.context}/create`, obj)
  }

  getRoomMessages(roomId: string) {
    return this._http
      .get(`${this.baseUrl}/${this.context}/get/${roomId}`)
  }

}