export interface Activity {
  _id: string,
  activity_name: string,
  activity_description: string,
  activity_date: number,
  created_at: string,
  recurring: number
  consumer: {
    name: string,
    id: string
  },
  provider: {
    name: string,
    id: string
  }
  community_id: string,
  status: {
    value: string,
    user_id: string,
    fullName: string
  }
  notes: string,
  source: string,
  destination: string
}
