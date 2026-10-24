export interface UserRecord {
  email: string;
  passwordHash: string;
  createdAt: number;
}

export interface Credentials {
  email: string;
  password: string;
  mode: 'signup' | 'login';
}

export interface SessionUser {
  email: string;
}