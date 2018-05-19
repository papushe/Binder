import {Injectable} from '@angular/core';
import {Loading, LoadingController, ToastController} from "ionic-angular";
import * as moment from "moment"
import * as _ from 'lodash';

@Injectable()
export class SharedService {
  loader: Loading;
  token: string;
  DATE_FORMAT = 'YYYY-MM-DD HH:mm';

  constructor(private loading: LoadingController,
              private toast: ToastController) {
  }

  createLoader(massage) {
    this.loader = null;
    this.loader = this.loading.create({
      content: massage
    });
  }

  createToast(msg) {
    let toast = this.toast.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }


  _() {
    return _;
  }

  storeToken(token) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  getCurrentLocalTime () {
    return moment().format();
  }

  convertToEpoch(date: string) {
    let dateUTC = date.toString().replace('Z','');
    return new Date(dateUTC).getTime();
  }

  convertEpochToDate(epochTimestamp: string) {
    if (!epochTimestamp) {
      return new Date();
    }
    return moment(new Date(parseInt(epochTimestamp))).format(this.DATE_FORMAT);
  }

  getRandomString(length) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

}
