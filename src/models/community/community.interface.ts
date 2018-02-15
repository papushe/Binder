export interface Community{
  communityName: string,
  communityDescription: string,
  creationDate: string,
  managerId: string,
  authorizedMembers: [{
    memberId:string
  }],
  members: [{
    memberId:string
  }],
  type: string
}
