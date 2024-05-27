export interface User {
  username: string;
  email: string;
  dateJoined: string;
}

export interface LoginResponse {
  date_joined: string;
  email: string;
  message: string;
  username: string;
}