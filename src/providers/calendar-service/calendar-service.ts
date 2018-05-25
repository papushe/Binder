import {Injectable} from '@angular/core';
import {Calendar} from "@ionic-native/calendar";
import {Activity} from "../../models/activity/activity.interface";

@Injectable()
export class CalendarServiceProvider {

  constructor(private calendar: Calendar) {
  }

  createEvent(activity: Activity) {
    let hour = 60 * 60 * 1000;
    let event;
    let options = {firstReminderMinutes: 60, secondReminderMinutes: 5, recurrence: activity.recurring || 'daily'};

    event = {
      title: activity.activity_name,
      location: activity.source,
      notes: activity.notes || '',
      startDate: new Date(activity.activity_date ),
      endDate: new Date(activity.activity_date + hour),
    };

    this.calendar.createEventInteractivelyWithOptions(event.title, event.location, event.notes, event.startDate, event.endDate, options)
      .then(data => {
        console.log(`new event was saved in calendar ${data}`);
      })
      .catch(err => {
        console.error(`failed to create a new event with error: ${err}`);
      });
  }

}
