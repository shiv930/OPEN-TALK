import { createSlice } from '@reduxjs/toolkit';

const readStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('opentalk_user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem('opentalk_user');
    return null;
  }
};

const initialUser = readStoredUser();

const initialState = {
  user: initialUser,
  isAuthenticated: !!initialUser,
  isInitialized: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      state.isInitialized = true;
      localStorage.removeItem('opentalk_token');
      if (user) {
        localStorage.setItem('opentalk_user', JSON.stringify(user));
      }
    },
    updateCurrentUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      state.isAuthenticated = true;
      localStorage.setItem('opentalk_user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('opentalk_token');
      localStorage.removeItem('opentalk_user');
    },
    setInitialized: (state, action) => {
      state.isInitialized = action.payload;
    },
  },
});

export const { setCredentials, updateCurrentUser, logout, setInitialized } = authSlice.actions;

export default authSlice.reducer;
