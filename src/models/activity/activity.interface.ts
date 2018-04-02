export interface Activity {
  _id: string,
  activity_name: string,
  activity_description: string,
  type: string,
  created_at: string,
  consumer_id: string,
  provider_id: string,
  community_id: string,
  notes: string,
  source: {
    city: string,
    street: string,
    number: string
  },
  destination: {
    city: string,
    street: string,
    number: string
  }
}
