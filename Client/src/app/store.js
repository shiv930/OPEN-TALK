import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '../features/ui/uiSlice';
import serverReducer from '../features/server/serverSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    server: serverReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
