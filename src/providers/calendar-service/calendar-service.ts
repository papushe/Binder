import {Injectable} from '@angular/core';
import {Calendar} from "@ionic-native/calendar";
import {Activity} from "../../models/activity/activity.interface";

/*
  Generated class for the CalendarServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CalendarServiceProvider {

  constructor(private calendar: Calendar) {
  }

  createEvent(activity: Activity) {
    let hour = 60 * 60 * 1000;
    let day = 24 * hour;
    let event;
    let options = {firstReminderMinutes: 60};
    let promises = [];

    for (let i = 0; i < activity.recurring; i++) {
      event = {
        title: activity.activity_name,
        location: activity.source,
        notes: activity.notes || '',
        startDate: new Date(activity.activity_date + (i * day)),
        endDate: new Date(activity.activity_date + hour + (i * day)),
      };
      promises.push(this.calendar.createEventInteractivelyWithOptions(event.title, event.location, event.notes, event.startDate, event.endDate, options));
    }
    Promise.all(promises)
      .then(data => {
        console.log(`new event was saved in calendar ${data}`);
      })
      .catch(err => {
        console.error(`failed to create a new event with error: ${err}`);
      });
  }

}
