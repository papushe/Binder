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
}
