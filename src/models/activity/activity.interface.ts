export interface Activity {
  _id: string,
  activity_name: string,
  activity_description: string,
  activity_date: string,
  type: string,
  created_at: string,
  consumer: {
    name: string,
    id: string
  },
  provider: {
    name: string,
    id: string
  }
  community_id: string,
  notes: string,
  source: string,
  destination: string
}
