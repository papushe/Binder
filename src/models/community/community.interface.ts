export interface Community{
  _id: string,
  communityName: string,
  communityDescription: string,
  creationDate: string,
  managerId: string,
  managerName: string,
  waiting_list: [string],
  authorizedMembers: [{
    memberId:string
  }],
  members: [{
    memberId:string
  }],
  type: string
}
