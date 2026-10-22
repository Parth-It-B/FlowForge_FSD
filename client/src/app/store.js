import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import issuesReducer from '../features/issues/issuesSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    issues: issuesReducer,
  },
});

export default store;
