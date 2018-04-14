import {Injectable} from '@angular/core';
import {Loading, LoadingController} from "ionic-angular";
import * as _ from 'lodash';


/*
  Generated class for the SharedService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SharedService {
  loader: Loading;

  constructor(private loading: LoadingController) {
  }

  createLoader(massage) {
    this.loader = null;
    this.loader = this.loading.create({
      content: massage
    });
  }
  lodash() {
    return _;
  }
}
