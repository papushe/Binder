import {User} from "../../models/user/user.interface";

const userList:User[] =[
  {firstName:'Naor', lastName:'Haimov', email: 'naor@haimov.com', avatar:'assets/imgs/avatar.png'},
  {firstName:'Tomer', lastName:'Katzav', email: 'tomer@Katzav.com', avatar:'assets/imgs/avatar.png'},
  {firstName:'Terry', lastName:'Meir', email: 'terry@meir.com', avatar:'assets/imgs/avatar.png'}
];

export const USER_LIST = userList;
