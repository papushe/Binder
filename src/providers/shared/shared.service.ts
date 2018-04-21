import {Injectable} from '@angular/core';
import {Loading, LoadingController, ToastController} from "ionic-angular";
import * as _ from 'lodash';


/*
  Generated class for the SharedService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
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
}
