import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Layers,
  ShieldCheck,
  Zap,
  Database,
  Lock,
  GitBranch,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const features = [
    {
      icon: Layers,
      title: 'Issue Tracking & Triage',
      desc: 'Track bugs, technical debt, and sprint tasks with customizable workflow statuses and priority levels.',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: Zap,
      title: 'Instant Search & Filters',
      desc: 'Filter workflows by status and search issue titles instantly with optimized debounced querying.',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      icon: GitBranch,
      title: 'Synchronized State',
      desc: 'Predictable, centralized application state ensuring seamless multi-view coordination and zero lag.',
      color: 'text-purple-600 bg-purple-50',
    },
    {
      icon: Database,
      title: 'High-Throughput REST API',
      desc: 'Engineered with Express and MongoDB schemas for high-speed CRUD operations and real-time metrics.',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      icon: ShieldCheck,
      title: 'Hardened API Security',
      desc: 'Secured with Helmet HTTP response headers, strict CORS whitelisting, and intelligent rate limiting.',
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      icon: Lock,
      title: 'Role-Based Access Control',
      desc: 'Fine-grained permissions powered by bcrypt encryption, signed JWTs, and strict privilege enforcement.',
      color: 'text-rose-600 bg-rose-50',
    },
  ];

  return (
    <div className="space-y-16 py-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Engineering Workflow & Issue Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Ship Higher Quality Software With FlowForge
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
          A centralized issue management platform designed for modern engineering teams to plan, triage, and resolve software defects with speed, precision, and security.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition"
            >
              Open Dashboard ({user?.role})
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold rounded-xl transition"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Engineered for High-Velocity Teams
          </h2>
          <p className="text-slate-600 mt-2">
            Everything you need to triage software defects, track sprint velocity, and safeguard critical workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed flex-grow">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
