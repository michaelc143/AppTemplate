export interface AuthResponse {
    date_joined: string;
    email: string;
    message: string;
    username: string;
    user_id: string;
    access_token: string;
    bio?: string;
}

export interface UsernameResponse {
    message: string;
    username: string;
}