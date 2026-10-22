import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api.js';

export const fetchIssues = createAsyncThunk(
  'issues/fetchIssues',
  async ({ status, search } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (status && status !== 'ALL') params.status = status;
      if (search && search.trim() !== '') params.search = search.trim();

      const response = await api.get('/issues', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch issues.'
      );
    }
  }
);

export const fetchStats = createAsyncThunk(
  'issues/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/issues/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch issue statistics.'
      );
    }
  }
);

export const createIssue = createAsyncThunk(
  'issues/createIssue',
  async (issueData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/issues', issueData);
      dispatch(fetchStats());
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create issue.'
      );
    }
  }
);

export const updateIssue = createAsyncThunk(
  'issues/updateIssue',
  async ({ id, issueData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/issues/${id}`, issueData);
      dispatch(fetchStats());
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update issue.'
      );
    }
  }
);

export const deleteIssue = createAsyncThunk(
  'issues/deleteIssue',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/issues/${id}`);
      dispatch(fetchStats());
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete issue.'
      );
    }
  }
);

const initialState = {
  issues: [],
  stats: {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    urgent: 0,
  },
  statusFilter: 'ALL',
  searchTerm: '',
  loading: false,
  error: null,
};

const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearIssueError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Issues
      .addCase(fetchIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = action.payload;
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Stats
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      // Create Issue
      .addCase(createIssue.fulfilled, (state, action) => {
        state.issues.unshift(action.payload);
      })
      .addCase(createIssue.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update Issue
      .addCase(updateIssue.fulfilled, (state, action) => {
        const index = state.issues.findIndex((i) => i._id === action.payload._id);
        if (index !== -1) {
          state.issues[index] = action.payload;
        }
      })
      .addCase(updateIssue.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete Issue
      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.issues = state.issues.filter((i) => i._id !== action.payload);
      })
      .addCase(deleteIssue.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setStatusFilter, setSearchTerm, clearIssueError } = issuesSlice.actions;
export default issuesSlice.reducer;
