export interface Profile{
  firstName:string;
  lastName:string;
  email:string;
  location?:string;
  phoneNumber:string;
  description?:string;
  type:string;
  dateOfBirth:Date;
  $key:string;
  skills?:[string]
  keyForFirebase:string;
  rank?:string;
  communities?:[{
    communityId?:string,
    role?:string
  }],
  profilePic:string
}
