import {Injectable} from '@angular/core';
import {Loading, LoadingController} from "ionic-angular";

/*
  Generated class for the SharedService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SharedService {
  loader: Loading;

  constructor(private loading: LoadingController) {
    console.log('Hello SharedService Provider');
  }

  createLoader(massage) {
    this.loader = null;
    this.loader = this.loading.create({
      content: massage
    });
  }
}
