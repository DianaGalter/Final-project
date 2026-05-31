import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  token?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  requires2FA: boolean;
  pendingUserId: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  requires2FA: false,
  pendingUserId: null,
};

export const register = createAsyncThunk(
  'auth/register',
  async (data: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      return authApi.register(data);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await authApi.login(data);
      if (res.requires2FA) {
        return { requires2FA: true, userId: res.userId };
      }
      return res as User;
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const verify2FA = createAsyncThunk(
  'auth/verify2FA',
  async (data: { userId: string; code: string }, { rejectWithValue }) => {
    try {
      return authApi.verify2FA(data);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || '2FA verification failed');
    }
  }
);

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    return authApi.me();
  } catch {
    return rejectWithValue('Not authenticated');
  }
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: Partial<User>, { rejectWithValue }) => {
    try {
      return authApi.updateProfile(data);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.requires2FA = false;
      state.pendingUserId = null;
      if (typeof window !== 'undefined') localStorage.removeItem('token');
    },
    setCredentials: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      if (action.payload.token && typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(register.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload;
        if (a.payload.token) localStorage.setItem('token', a.payload.token);
      })
      .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        const payload = a.payload as User & { requires2FA?: boolean; userId?: string };
        if (payload.requires2FA) {
          s.requires2FA = true;
          s.pendingUserId = payload.userId || null;
        } else {
          s.user = payload as User;
          s.requires2FA = false;
          if ((payload as User).token) localStorage.setItem('token', (payload as User).token!);
        }
      })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })
      .addCase(verify2FA.fulfilled, (s, a) => {
        s.user = a.payload;
        s.requires2FA = false;
        if (a.payload.token) localStorage.setItem('token', a.payload.token);
      })
      .addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload; })
      .addCase(updateProfile.fulfilled, (s, a) => {
        s.user = { ...s.user, ...a.payload } as User;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
