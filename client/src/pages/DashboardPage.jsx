import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchIssues,
  fetchStats,
  createIssue,
  updateIssue,
  deleteIssue,
  clearIssueError,
} from '../features/issues/issuesSlice.js';
import { useDebounce } from '../hooks/useDebounce.js';
import StatCard from '../components/StatCard.jsx';
import IssueModal from '../components/IssueModal.jsx';
import {
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertOctagon,
  Trash2,
  Edit2,
  UserCheck,
  AlertCircle,
  Inbox,
  X,
  Keyboard,
} from 'lucide-react';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { issues, stats, loading, error } = useSelector((state) => state.issues);

  // Local UI state
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchInput, setSearchInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Debounced search query
  const debouncedSearch = useDebounce(searchInput, 350);

  // DOM ref to search input for keyboard shortcut
  const searchInputRef = useRef(null);

  // Global keyboard shortcut '/' to quickly focus the search bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch issues whenever filters or debounced search changes
  useEffect(() => {
    dispatch(fetchIssues({ status: statusFilter, search: debouncedSearch }));
  }, [dispatch, statusFilter, debouncedSearch]);

  // Fetch stats on initial mount
  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  const handleOpenCreateModal = () => {
    setEditingIssue(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (issue) => {
    setEditingIssue(issue);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingIssue) {
        await dispatch(updateIssue({ id: editingIssue._id, issueData: formData })).unwrap();
      } else {
        await dispatch(createIssue(formData)).unwrap();
      }
      setIsModalOpen(false);
      setEditingIssue(null);
    } catch (err) {
      console.error('Failed to save issue:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      await dispatch(deleteIssue(issueId));
    }
  };

  // Helper for priority badges
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Helper for status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'IN_PROGRESS':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'RESOLVED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CLOSED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Engineering Issue Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Logged in as <span className="font-semibold text-slate-800">{user?.name}</span> (
            <span className="font-semibold text-emerald-600 capitalize">{user?.role}</span>)
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm transition"
        >
          <Plus className="w-5 h-5" />
          <span>New Issue</span>
        </button>
      </div>

      {/* Backend API Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => dispatch(clearIssueError())}
            className="text-red-500 hover:text-red-700 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Dynamic Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          label="Total Issues"
          count={stats?.total}
          icon={Inbox}
          colorClass="text-slate-700"
          bgClass="bg-slate-100"
        />
        <StatCard
          label="Open"
          count={stats?.open}
          icon={AlertCircle}
          colorClass="text-amber-700"
          bgClass="bg-amber-100"
        />
        <StatCard
          label="In Progress"
          count={stats?.inProgress}
          icon={Clock}
          colorClass="text-blue-700"
          bgClass="bg-blue-100"
        />
        <StatCard
          label="Resolved"
          count={stats?.resolved}
          icon={CheckCircle}
          colorClass="text-emerald-700"
          bgClass="bg-emerald-100"
        />
        <StatCard
          label="Closed"
          count={stats?.closed}
          icon={CheckCircle}
          colorClass="text-slate-600"
          bgClass="bg-slate-100"
        />
        <StatCard
          label="Urgent"
          count={stats?.urgent}
          icon={AlertOctagon}
          colorClass="text-red-700"
          bgClass="bg-red-100"
        />
      </div>

      {/* Controls: Search & Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input with useRef hook */}
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search issues by title... (Press / to focus)"
            className="w-full pl-9 pr-14 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {searchInput ? (
            <button
              onClick={() => setSearchInput('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs text-slate-400">
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px]">
                /
              </kbd>
            </span>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Issues Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading && issues.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-3"></div>
            Loading issues...
          </div>
        ) : issues.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No issues found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {searchInput || statusFilter !== 'ALL'
                ? 'Try adjusting your search query or status filter.'
                : 'Click "New Issue" above to create your first tracking item.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {issues.map((issue) => {
              const canModify =
                user?.role === 'admin' ||
                (issue.createdBy && (issue.createdBy._id === user?.id || issue.createdBy === user?.id));

              return (
                <div
                  key={issue._id}
                  className="p-5 hover:bg-slate-50/70 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getStatusBadge(
                          issue.status
                        )}`}
                      >
                        {issue.status.replace('_', ' ')}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-medium border ${getPriorityBadge(
                          issue.priority
                        )}`}
                      >
                        {issue.priority}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 truncate">
                        {issue.title}
                      </h3>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2">
                      {issue.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        Assignee: <strong className="text-slate-700">{issue.assignedTo}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Reporter:{' '}
                        <strong className="text-slate-700">
                          {issue.createdBy?.name || 'User'}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        Created: {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                    {canModify ? (
                      <>
                        <button
                          onClick={() => handleOpenEditModal(issue)}
                          className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title="Edit Issue"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteIssue(issue._id)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title={user?.role === 'admin' ? 'Delete Issue (Admin)' : 'Delete Issue'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <span
                        className="text-xs text-slate-400 italic px-2 py-1"
                        title="Only the issue reporter or an administrator can modify this item"
                      >
                        Read Only
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <IssueModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingIssue(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={editingIssue}
        isSubmitting={submitting}
      />
    </div>
  );
}
