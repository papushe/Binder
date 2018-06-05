export interface Profile {
  firstName: string,
  lastName: string,
  email: string,
  location?: string,
  phoneNumber: string,
  description?: string,
  dateOfBirth: Date,
  creationDate: number,
  $key: string,
  skills?: [string],
  keyForFirebase: string,
  rank: number;
  votes: {
    up: number,
    down: number
  },
  activities: [{
    activityId: string
  }],
  communities?: [{
    communityId: string,
    role: string
  }],
  profilePic?: string,
  fullName?: string,
  chats: [{
    chatRoomId: string,
    talkedToId: string,
    talkedToName: string,
    talkedFromName: string,
    profilePic: string,
  }]
}
