import {Injectable} from '@angular/core';
import {Calendar} from "@ionic-native/calendar";
import {Activity} from "../../models/activity/activity.interface";

@Injectable()
export class CalendarService {

  permission: boolean;
  activity: Activity;

  constructor(private calendar: Calendar) {
    this.calendar.hasReadPermission()
      .then(data => {
        this.permission = data;
      })
      .catch(err => {
        this.permission = false;
      });
  }

  askForPermission() {
    this.calendar.requestReadWritePermission()
      .then(res => {
        this.permission = res;
        this.createEvent(this.activity);
      })
      .catch(err => {
        this.permission = false;
      })
  }
  createEvent(activity: Activity) {
    this.activity = activity;

    if(!this.permission) {
      this.askForPermission();
    }

    let hour = 60 * 60 * 1000;
    let event;
    let options = {
      id: activity._id,
      firstReminderMinutes: 120,
      secondReminderMinutes: 30,
      recurrence: (activity.recurring !== 'once') ? activity.recurring : ''
    };

    event = {
      title: activity.activity_name,
      location: activity.source,
      notes: activity.notes || '',
      startDate: new Date(activity.activity_date ),
      endDate: new Date(activity.activity_date + hour),
    };

    this.calendar.createEventInteractivelyWithOptions(event.title, event.location, event.notes, event.startDate, event.endDate, options)
      .then(data => {
        console.log(`new event was saved in user calendar ${data}`);
      })
      .catch(err => {
        console.error(`failed to create a new event with error: ${err}`);
      });
  }

}
