# Graph Report - FSD_Final  (2026-10-15)

## Corpus Check
- 38 files · ~11,236 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 223 nodes · 299 edges · 15 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `003a4b53`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- FlowForge — Academic Experiments Guide
- App.jsx
- issueRoutes.js
- dependencies
- app.js
- client/package.json
- keywords
- DashboardPage.jsx
- dependencies
- FlowForge — Engineering Workflow & Issue Management Platform
- server/package.json
- run-dev.js

## God Nodes (most connected - your core abstractions)
1. `react` - 12 edges
2. `FlowForge — Engineering Workflow & Issue Management Platform` - 9 edges
3. `DashboardPage()` - 8 edges
4. `scripts` - 8 edges
5. `keywords` - 8 edges
6. `FlowForge — Academic Experiments Guide` - 8 edges
7. `connectDB()` - 7 edges
8. `scripts` - 5 edges
9. `Experiment 1 — Tailwind CSS and Responsive UI` - 5 edges
10. `scripts` - 4 edges

## Surprising Connections (you probably didn't know these)
- `seedDatabase()` --calls--> `connectDB()`  [EXTRACTED]
  server/seed.js → server/src/config/db.js
- `startServer()` --calls--> `connectDB()`  [EXTRACTED]
  server/src/server.js → server/src/config/db.js
- `runTests()` --calls--> `connectDB()`  [EXTRACTED]
  server/test-server.js → server/src/config/db.js
- `App()` --calls--> `fetchCurrentUser`  [EXTRACTED]
  client/src/App.jsx → client/src/features/auth/authSlice.js
- `Navbar()` --calls--> `logoutUser`  [EXTRACTED]
  client/src/components/Navbar.jsx → client/src/features/auth/authSlice.js

## Import Cycles
- None detected.

## Communities (15 total, 0 thin omitted)

### Community 0 - "FlowForge — Academic Experiments Guide"
Cohesion: 0.07
Nodes (27): 1. Files Demonstrating This Experiment, 1. Files Demonstrating This Experiment, 1. Files Demonstrating This Experiment, 1. Files Demonstrating This Experiment, 1. Files Demonstrating This Experiment, 1. Files Demonstrating This Experiment, 2. How to Demonstrate in Class, 2. How to Demonstrate in Class (+19 more)

### Community 1 - "App.jsx"
Cohesion: 0.17
Nodes (15): App(), store, Navbar(), ProtectedRoute(), authSlice, fetchCurrentUser, initialState, loginUser (+7 more)

### Community 2 - "issueRoutes.js"
Cohesion: 0.16
Nodes (16): generateToken(), getMe(), login(), logout(), register(), sendTokenResponse(), createIssue(), deleteIssue() (+8 more)

### Community 3 - "dependencies"
Cohesion: 0.10
Nodes (21): bcryptjs, cookie-parser, cors, dotenv, express, express-rate-limit, helmet, jsonwebtoken (+13 more)

### Community 4 - "app.js"
Cohesion: 0.15
Nodes (13): seedDatabase(), app, authLimiter, generalLimiter, connectDB(), errorHandler(), notFound(), issueSchema (+5 more)

### Community 5 - "client/package.json"
Cohesion: 0.10
Nodes (19): autoprefixer, devDependencies, autoprefixer, postcss, tailwindcss, vite, @vitejs/plugin-react, name (+11 more)

### Community 6 - "keywords"
Cohesion: 0.10
Nodes (19): description, keywords, name, scripts, build:client, dev, dev:client, dev:server (+11 more)

### Community 7 - "DashboardPage.jsx"
Cohesion: 0.21
Nodes (12): IssueModal(), StatCard(), createIssue, deleteIssue, fetchIssues, fetchStats, initialState, issuesSlice (+4 more)

### Community 8 - "dependencies"
Cohesion: 0.12
Nodes (17): axios, dependencies, axios, lucide-react, react, react-dom, react-hook-form, react-redux (+9 more)

### Community 9 - "FlowForge — Engineering Workflow & Issue Management Platform"
Cohesion: 0.17
Nodes (11): Academic Experiments Mapping, Demo Accounts, FlowForge — Engineering Workflow & Issue Management Platform, Installation & Setup, Option A: Run Both Client & Server Concurrently, Option B: Run in Separate Terminals, Prerequisites, Project Structure (+3 more)

### Community 10 - "server/package.json"
Cohesion: 0.18
Nodes (10): description, main, name, scripts, dev, seed, start, test (+2 more)

### Community 11 - "run-dev.js"
Cohesion: 0.40
Nodes (3): clientProc, __dirname, serverProc

## Knowledge Gaps
- **96 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+91 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `keywords` connect `keywords` to `App.jsx`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Why does `react` connect `App.jsx` to `keywords`, `DashboardPage.jsx`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `express` connect `keywords` to `issueRoutes.js`, `app.js`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _96 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `FlowForge — Academic Experiments Guide` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.14761904761904762 - nodes in this community are weakly interconnected._