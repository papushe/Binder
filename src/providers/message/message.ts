import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {SharedService} from "../shared/shared.service";

@Injectable()
export class MessageService {

  baseUrl: string = '';
  context: string = 'message';

  constructor(private _http: HttpClient,
              private sharedService: SharedService) {
    this.baseUrl = this.sharedService.baseUrl;
  }

  getRoomMessages(roomId: string) {
    return this._http
      .get(`${this.baseUrl}/${this.context}/get/${roomId}`)
  }

}
