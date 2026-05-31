import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  requires2FA: boolean;
  pendingUserId: string | null;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  requires2FA: false,
  pendingUserId: null,
  error: null,
};

export const adminLogin = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await authApi.login(data);
      if (res.requires2FA) {
        return { requires2FA: true, userId: res.userId };
      }
      if (res.role !== 'admin') {
        return rejectWithValue('Admin access only');
      }
      return res;
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
      const res = await authApi.verify2FA(data);
      if (res.role !== 'admin') return rejectWithValue('Admin access only');
      return res;
    } catch {
      return rejectWithValue('Invalid code');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('crm_token');
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (s) => { s.loading = true; })
      .addCase(adminLogin.fulfilled, (s, a) => {
        s.loading = false;
        const p = a.payload as User & { requires2FA?: boolean; userId?: string };
        if (p.requires2FA) {
          s.requires2FA = true;
          s.pendingUserId = p.userId || null;
        } else {
          s.user = p;
          s.requires2FA = false;
          if (p.token) localStorage.setItem('crm_token', p.token);
        }
      })
      .addCase(adminLogin.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })
      .addCase(verify2FA.fulfilled, (s, a) => {
        s.user = a.payload;
        s.requires2FA = false;
        if (a.payload.token) localStorage.setItem('crm_token', a.payload.token);
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
