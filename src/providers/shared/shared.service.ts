import {Injectable} from '@angular/core';
import {Loading, LoadingController, ToastController} from "ionic-angular";
import * as moment from "moment"
import * as _ from 'lodash';

@Injectable()
export class SharedService {

  loader: Loading;
  token: string;
  baseUrl: string = '';
  DATE_FORMAT = 'YYYY-MM-DD HH:mm';

  constructor(private loading: LoadingController,
              private toast: ToastController) {
    this.baseUrl = 'http://localhost:4300';
    // this.baseUrl = 'https://appbinder.herokuapp.com';
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
      duration: 2000,
      position: 'top'
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

  getCurrentLocalTime() {
    return moment().format();
  }

  convertToEpoch(date: string) {
    let dateUTC = date.toString().replace('Z', '');
    return new Date(dateUTC).getTime();
  }

  convertEpochToDate(epochTimestamp: string) {
    if (!epochTimestamp) {
      return new Date();
    }
    return moment(new Date(parseInt(epochTimestamp))).format(this.DATE_FORMAT);
  }

  convertToISO(date: number) {
    let offsetInMS = new Date().getTimezoneOffset() * 60 * 1000;
    let dateInMS = new Date(date).getTime();
    console.log(new Date(dateInMS - offsetInMS).toISOString().replace('Z', ''));
    return new Date(dateInMS - offsetInMS).toISOString().replace('Z', '');
  }

  ISOToLocal(iso: string) {
    let isoStr = iso.replace('Z', '');
    return new Date(isoStr).getTime();
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
