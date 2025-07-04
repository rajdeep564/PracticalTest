export interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginResponse {
  token: string;
  role: string;
}
