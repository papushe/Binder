export interface Notification {
  _id: string,
  from: {
    id: string,
    name: string,
  },
  to:  {
    id: string,
    name: string,
  },
  room: string,
  event: string,
  content: string,
  creation_date: string,
  status: string
}
