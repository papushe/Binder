export interface Profile {
  firstName: string,
  lastName: string,
  email: string,
  location?: string,
  phoneNumber: string,
  description?: string,
  dateOfBirth: Date,
  $key: string,
  skills?: [string],
  keyForFirebase: string,
  rank: number;
  votes: {
    up: number,
    down: number
  },
  communities?: [{
    communityId: string,
    role: string
  }],
  profilePic: string,
  fullName?: string
}
