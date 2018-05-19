export interface Community {
  _id: string,
  communityName: string,
  communityDescription: string,
  creationDate: string,
  manager: {
    id: string,
    name: string,
  },
  waiting_list: [string],
  members: [{
    memberId: string
  }],
  type: string
}
