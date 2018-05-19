import {Profile} from "../profile/profile.interface";

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
  creation_date: string,
  status: string,
  user: Profile
}
