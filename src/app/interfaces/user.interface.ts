export interface User {
  id: string;
  username: string;
  email: string;
  token?: string;
  createdAt?: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}
