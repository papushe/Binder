export interface Notification {
  _id: string,
  from: {
    id: string,
    fullName: string,
  },
  to:  {
    id: string,
    fullName: string,
  },
  room: string,
  event: string,
  content: string,
  creation_date: string,
  status: string
}
