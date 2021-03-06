import {Profile} from "../profile/profile.interface";
import {Activity} from "../activity/activity.interface";

export interface Notification {
  _id: string,
  from: {
    keyForFirebase: string,
    fullName: string,
    profilePic: string
  },
  to: {
    keyForFirebase: string,
    fullName: string,
    profilePic: string
  },
  room: string,
  event: string,
  content: string,
  creation_date: number,
  status: string,
  activity: Activity
  user: Profile,
  isAddToCalender: boolean
}
