import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiLogin, apiSignUp, clearTokens, type LoginPayload, type SignUpPayload } from '@/lib/api';

interface AuthUser {
  name: string;
  email: string;
  user_id: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('qurate_user') || 'null'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await apiLogin(payload);
      if (res.status === 200 || res.data.status === 200) {
        return { email: payload.email };
      }
      return rejectWithValue(res.data.message || 'Login failed');
    } catch {
      return rejectWithValue('Network error');
    }
  }
);

export const signUpUser = createAsyncThunk(
  'auth/signUp',
  async (payload: SignUpPayload, { rejectWithValue }) => {
    try {
      const res = await apiSignUp(payload);
      if (res.data.status === 201 || res.data.status === 200) {
        return { name: payload.name, email: payload.email };
      }
      return rejectWithValue(res.data.message || 'Sign up failed');
    } catch {
      return rejectWithValue('Network error');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      clearTokens();
      localStorage.removeItem('qurate_user');
    },
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('qurate_user', JSON.stringify(action.payload));
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = { name: '', email: action.payload.email, user_id: '' };
        localStorage.setItem('qurate_user', JSON.stringify(state.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { name: action.payload.name, email: action.payload.email, user_id: '' };
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
