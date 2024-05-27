export interface User {
  username: string;
  email: string;
  dateJoined: string;
}

export interface AuthResponse {
  date_joined: string;
  email: string;
  message: string;
  username: string;
}