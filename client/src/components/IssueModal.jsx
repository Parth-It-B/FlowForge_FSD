import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';

export default function IssueModal({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) {
  // Direct DOM ref to auto-focus the title input when modal opens
  const titleInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'OPEN',
      priority: 'MEDIUM',
      assignedTo: '',
    },
  });

  // Populate form with existing data when editing, or reset when creating
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'OPEN',
        priority: initialData.priority || 'MEDIUM',
        assignedTo: initialData.assignedTo || '',
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'OPEN',
        priority: 'MEDIUM',
        assignedTo: '',
      });
    }
  }, [initialData, reset, isOpen]);

  // Focus title field whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // React Hook Form ref callback merge
  const { ref: formTitleRef, ...titleRegisterProps } = register('title', {
    required: 'Issue title is required',
    minLength: { value: 3, message: 'Title must be at least 3 characters' },
    maxLength: { value: 120, message: 'Title cannot exceed 120 characters' },
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {initialData ? 'Edit Issue' : 'Create New Issue'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Memory leak in background worker"
              className={`w-full px-3 py-2 border rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.title ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
              }`}
              {...titleRegisterProps}
              ref={(e) => {
                formTitleRef(e);
                titleInputRef.current = e;
              }}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Detailed reproduction steps and expected behavior..."
              className={`w-full px-3 py-2 border rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.description ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
              }`}
              {...register('description', {
                required: 'Issue description is required',
                minLength: { value: 5, message: 'Description must be at least 5 characters' },
                maxLength: { value: 1000, message: 'Description cannot exceed 1000 characters' },
              })}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.description.message}</p>
            )}
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                {...register('status')}
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Priority
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                {...register('priority')}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Assignee
            </label>
            <input
              type="text"
              placeholder="e.g. Sarah Connor or Team Alpha"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register('assignedTo')}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
