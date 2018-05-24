import {Pipe, PipeTransform} from '@angular/core';
import * as moment from "moment"

/**
 * Generated class for the ConvertDatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'convertDate',
})
export class ConvertDatePipe implements PipeTransform {
  DATE_FORMAT = 'YYYY-MM-DD HH:mm';

  transform(value: string, ...args) {

    if (!value) {
      return moment().format(this.DATE_FORMAT);
    }

    return moment(new Date(parseInt(value))).format(this.DATE_FORMAT);
  }
}
