import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthState, LoginData, User } from '../types/auth';
import { loginApi } from '../utils/api';
import { isTokenExpired, getUserFromToken } from '../utils/jwt';

// Get initial state from localStorage
const getInitialState = (): AuthState => {
  const token = localStorage.getItem('token');
  let user: User | null = null;
  let isAuthenticated = false;

  if (token) {
    if (!isTokenExpired(token)) {
      const userFromToken = getUserFromToken(token);
      if (userFromToken) {
        user = {
          id: userFromToken.id,
          email: userFromToken.email,
          role: userFromToken.role
        };
        isAuthenticated = true;
      }
    } else {
      localStorage.removeItem('token');
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    loading: false,
    error: null
  };
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData: LoginData, { rejectWithValue }) => {
    try {
      const response = await loginApi(loginData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        
        // Decode token to get user info
        const userFromToken = getUserFromToken(action.payload.token);
        if (userFromToken) {
          state.user = {
            id: userFromToken.id,
            email: userFromToken.email,
            role: userFromToken.role
          };
        }
        
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  }
});

const { logout, clearError } = authSlice.actions;

const authExports = {
  loginUser,
  logout,
  clearError,
  reducer: authSlice.reducer,
};

export default authExports;
