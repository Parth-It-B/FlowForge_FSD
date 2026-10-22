import React from 'react';

export default function StatCard({ label, count, icon: Icon, colorClass, bgClass }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{count ?? 0}</p>
      </div>
      <div className={`p-3 rounded-lg ${bgClass} ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
