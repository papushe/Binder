import {Injectable} from '@angular/core';
import {Loading, LoadingController, ToastController} from "ionic-angular";
import * as moment from "../../../node_modules/moment"
import * as _ from 'lodash';

@Injectable()
export class SharedService {
  loader: Loading;
  token: string;

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
     let tz = new Date().getTimezoneOffset() * (60 * 1000);
     tz *= 2;
     console.log(`${tz}`);
    // console.log(`---1> ${date}`);
    // console.log(`---2> ${moment(date).unix().toString()}`);
    // console.log(`---2> ${new Date(date).getTime()}`);
    // console.log(`---3> ${new Date(date).toUTCString()}`);
    // console.log(`---3> ${moment(date).unix()}`);
    console.log((moment(date).unix() + tz).toString());
    return (moment(date).unix() + tz).toString();
  }

  convertEpochToDate(epochTimestamp: string) {
    // console.log(`---1> ${epochTimestamp}`);
    // console.log(`---2> ${moment(epochTimestamp).local().toString()}`);
    // console.log(`---3> ${moment.unix(parseInt(epochTimestamp)).local().toString()}`);
    // console.log(`---4> ${moment.unix(parseInt(epochTimestamp)).toString()}`);
    // console.log(`---5> ${moment.unix(parseInt(epochTimestamp)).format()}`);
    // console.log(`---6> ${moment.unix(parseInt(epochTimestamp))}`);
    // console.log(`---7> ${moment(epochTimestamp).local().format()}`);
    // return moment(epochTimestamp).local().toString();
    return moment.unix(parseInt(epochTimestamp)).toString();
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
