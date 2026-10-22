# FlowForge — Academic Experiments Guide

This document maps all six required experiments to their exact files in the codebase, with step-by-step instructions for demonstrating them in class, expected outputs, and likely viva examination questions and answers.

---

## Quick Start for Demonstration

```bash
# 1. Start both backend and frontend concurrently
npm run dev

# 2. Or run them in separate terminals
npm run dev:server   # Starts Express REST API on http://localhost:5000
npm run dev:client   # Starts Vite React frontend on http://localhost:5173

# 3. Optional: Run the automated backend verification test suite
npm run test:server
```

---

## Experiment 1 — Tailwind CSS and Responsive UI

### 1. Files Demonstrating This Experiment
- [`client/src/pages/HomePage.jsx`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/client/src/pages/HomePage.jsx): Hero section, 6-experiment feature grid, and responsive call-to-actions.
- [`client/src/pages/LoginPage.jsx`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/client/src/pages/LoginPage.jsx) & [`client/src/pages/RegisterPage.jsx`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/client/src/pages/RegisterPage.jsx): Centered responsive cards, field icons, and demo account helper boxes.
- [`client/src/pages/DashboardPage.jsx`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/client/src/pages/DashboardPage.jsx): Responsive 6-column to 2-column metrics grid, search bar, and issue list.
- [`client/src/components/Navbar.jsx`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/client/src/components/Navbar.jsx): Responsive desktop navigation and mobile hamburger toggle menu.
- [`client/tailwind.config.js`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/client/tailwind.config.js) & [`client/src/index.css`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/client/src/index.css): Utility setup and custom palette configuration.

### 2. How to Demonstrate in Class
1. Open `http://localhost:5173` in Google Chrome.
2. Open Developer Tools (`F12` or `Ctrl+Shift+I`) and toggle the Device Toolbar (`Ctrl+Shift+M`).
3. Switch between **Desktop (1920px)**, **Tablet (768px)**, and **Mobile (375px)**:
   - On Desktop: Navbar shows full navigation links and user badges.
   - On Mobile: Navbar collapses into a responsive hamburger menu.
   - On Dashboard: The 6 stat cards fluidly adapt from 6 columns on large screens to 2 columns on mobile devices (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-6`).

### 3. What Output to Show
- Clean responsive layout without horizontal scrolling or broken elements on any screen width.
- Colored priority badges (`URGENT` red, `HIGH` amber, `MEDIUM` blue, `LOW` slate) and status pills.

### 4. Likely Viva Questions & Answers
- **Q: What is the difference between Tailwind CSS and traditional CSS / Bootstrap?**
  *A:* Tailwind is a utility-first CSS framework that composes styles directly in markup using atomic classes (e.g. `flex`, `p-4`, `rounded-xl`). Unlike Bootstrap, it does not force opinionated pre-built UI components, resulting in leaner custom designs and purging unused CSS during production builds.
- **Q: How does Tailwind achieve mobile-first responsiveness?**
  *A:* Unprefixed classes target mobile by default (e.g. `grid-cols-2`). Breakpoint prefixes like `sm:` (640px), `md:` (768px), and `lg:` (1024px) apply styles using CSS `min-width` media queries as the screen widens.

---

## Experiment 2 — React Hooks

### 1. Files Demonstrating This Experiment
- [`client/src/hooks/useDebounce.js`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/client/src/hooks/useDebounce.js): Custom hook utilizing `useState` and `useEffect` with cleanup timer to throttle search queries.
- [`client/src/components/IssueModal.jsx`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/client/src/components/IssueModal.jsx):
  - **`useRef`**: `titleInputRef` programmatically focuses the title `<input>` whenever the modal opens.
  - **React Hook Form**: `useForm` managing validation rules (`required`, `minLength`, `maxLength`) without unnecessary component re-renders.
- [`client/src/pages/DashboardPage.jsx`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/client/src/pages/DashboardPage.jsx):
  - **`useState`**: Filter selections, search input text, modal open/close state.
  - **`useEffect`**: Re-queries issues when filters change; sets up global `/` keyboard shortcut listener.
  - **`useRef`**: `searchInputRef` focused instantly when pressing `/` on keyboard.
- [`client/src/services/api.js`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/client/src/services/api.js): Axios instance with request/response interceptors.

### 2. How to Demonstrate in Class
1. Go to the Dashboard and press the `/` key on your keyboard. Point out how the search input is focused immediately via `useRef`.
2. Click **"New Issue"**: observe how the modal opens and the **Title input is automatically focused** using `titleInputRef.current?.focus()`.
3. Try submitting an empty form: observe React Hook Form client-side validation errors appearing instantly without submitting a request.
4. Type in the search box: show the network tab — the custom `useDebounce` hook prevents API requests on every single keystroke, waiting 350ms after typing stops.

### 3. Likely Viva Questions & Answers
- **Q: Why use `useRef` instead of `document.getElementById`?**
  *A:* `useRef` directly references the actual DOM element within React's virtual DOM lifecycle. It avoids brittle global DOM queries and persists between renders without causing re-renders when mutated.
- **Q: Why use React Hook Form over controlled `useState` inputs?**
  *A:* React Hook Form uses uncontrolled inputs under the hood via refs, preventing the entire component from re-rendering on every keystroke, which improves performance on complex forms.
- **Q: What is the purpose of returning a function inside `useEffect`?**
  *A:* It serves as a cleanup mechanism (equivalent to `componentWillUnmount`). In `useDebounce`, it clears `clearTimeout(handler)` to cancel pending timers if the value changes before the delay completes.

---

## Experiment 3 — Redux Toolkit

### 1. Files Demonstrating This Experiment
- [`client/src/app/store.js`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/client/src/app/store.js): Central Redux store created with `configureStore`.
- [`client/src/features/auth/authSlice.js`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/client/src/features/auth/authSlice.js): Authentication state, token storage, and async thunks (`loginUser`, `registerUser`, `logoutUser`, `fetchCurrentUser`).
- [`client/src/features/issues/issuesSlice.js`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/client/src/features/issues/issuesSlice.js): Global issues list, stats, and async thunks (`fetchIssues`, `createIssue`, `updateIssue`, `deleteIssue`, `fetchStats`).
- [`client/src/pages/DashboardPage.jsx`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/client/src/pages/DashboardPage.jsx): Subscribes to global state via `useSelector` and dispatches actions with `useDispatch`.

### 2. How to Demonstrate in Class
1. Open Redux DevTools or inspect Redux state in console.
2. Log in as a user: show the `auth/loginUser/fulfilled` action mutating `state.auth.isAuthenticated` to `true` and saving the user object.
3. Create or delete an issue: show `issues/createIssue/fulfilled` or `issues/deleteIssue/fulfilled` dispatching and immediately re-triggering `fetchStats()` to refresh global metrics across all components.
4. Show that local UI state (such as modal open/closed and temporary search typing) remains inside local component state (`useState`), keeping the Redux store clean.

### 3. Likely Viva Questions & Answers
- **Q: What problem does Redux Toolkit solve compared to classic Redux?**
  *A:* Classic Redux required extensive boilerplate: action types, action creators, switch-case reducers, and manual immutability libraries. Redux Toolkit's `createSlice` auto-generates action types/creators and uses Immer internally so we can write clean mutable-style state updates safely.
- **Q: What does `createAsyncThunk` do?**
  *A:* It abstracts asynchronous operations (like Axios API requests) and automatically dispatches lifecycle actions: `pending`, `fulfilled`, and `rejected`.

---

## Experiment 4 — REST API and MongoDB

### 1. Files Demonstrating This Experiment
- [`server/src/models/User.js`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/server/src/models/User.js): User schema with email validation, bcrypt pre-save hook, and `comparePassword` method.
- [`server/src/models/Issue.js`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/server/src/models/Issue.js): Issue schema with enums for `status` and `priority`, and ObjectId reference to `User`.
- [`server/src/controllers/issueController.js`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/server/src/controllers/issueController.js):
  - `getIssues`: Regex search and status filtering via Mongoose queries.
  - `getStats`: Aggregates real-time document counts (`Issue.countDocuments`).
  - `createIssue`: Persists new document and populates creator details.
  - `updateIssue` & `deleteIssue`: Modifies and removes documents.
- [`server/src/config/db.js`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/server/src/config/db.js): Resilient Mongoose connection with automatic fallback to in-memory MongoDB.

### 2. How to Demonstrate in Class
1. Run `node server/test-server.js` or demonstrate via Postman / Browser:
   - `GET /api/issues`: Returns populated JSON array of issues sorted by `-createdAt`.
   - `GET /api/issues/stats`: Returns `{ total, open, inProgress, resolved, closed, urgent }`.
   - `POST /api/issues`: Creates a new issue in MongoDB.
   - `PUT /api/issues/:id`: Updates status from `OPEN` to `IN_PROGRESS`.
   - `DELETE /api/issues/:id`: Removes the document from MongoDB.
2. In the UI, add an issue and observe the "Total Issues" and "Open" metric cards increment in real-time.

### 3. Likely Viva Questions & Answers
- **Q: What is Mongoose and what is the difference between Schema and Model?**
  *A:* Mongoose is an Object Data Modeling (ODM) library for MongoDB. A **Schema** defines the structure, data types, and validation rules for documents, while a **Model** is a compiled constructor providing an interface to query and update the MongoDB collection.
- **Q: How does FlowForge calculate dashboard statistics from MongoDB?**
  *A:* In `issueController.js`, `Promise.all` executes concurrent `Issue.countDocuments({ status: ... })` queries, ensuring non-blocking, fast aggregation.

---

## Experiment 5 — Secure REST APIs

### 1. Files Demonstrating This Experiment
- [`server/src/app.js`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/server/src/app.js):
  - **Helmet**: `app.use(helmet())` sets security headers (X-Content-Type-Options, Strict-Transport-Security, X-Frame-Options).
  - **CORS**: Whitelists frontend origin (`http://localhost:5173`) with `credentials: true`.
  - **Rate Limiting**: `express-rate-limit` limits general API requests to 200/15min, and auth routes to 30/15min to thwart brute-force attacks.
- [`server/src/middleware/validateMiddleware.js`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/server/src/middleware/validateMiddleware.js): Validates email regex, string lengths, and restricts allowed enum values.
- [`server/src/middleware/errorMiddleware.js`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/server/src/middleware/errorMiddleware.js): Centralized error handler catching Mongoose `CastError`, duplicate key `11000`, and validation errors.

### 2. How to Demonstrate in Class
1. Inspect response headers in the browser Network tab for any API call (`http://localhost:5000/api/health`):
   - Notice `X-Content-Type-Options: nosniff`
   - Notice `X-DNS-Prefetch-Control: off`
   - Notice CORS headers: `Access-Control-Allow-Origin: http://localhost:5173`
2. Test input validation: Send an invalid registration or create issue request with missing title:
   - Returns HTTP `400 Bad Request` with structured error message `{ success: false, message: "Issue title is required." }`.
3. Try accessing an invalid URL (e.g. `/api/unknown`):
   - Returns centralized 404 handler response: `{ success: false, message: "Resource not found - /api/unknown" }`.

### 3. Likely Viva Questions & Answers
- **Q: What does Helmet middleware do in Express?**
  *A:* Helmet secures Express apps by setting various HTTP headers that mitigate common web vulnerabilities such as Cross-Site Scripting (XSS), clickjacking, and MIME sniffing.
- **Q: Why is rate limiting crucial on authentication routes?**
  *A:* Rate limiting restricts the number of login/registration attempts from a single IP within a timeframe, mitigating automated credential stuffing, brute-force password guessing, and Denial of Service (DoS).

---

## Experiment 6 — JWT Authentication & Role-Based Access Control

### 1. Files Demonstrating This Experiment
- [`server/src/controllers/authController.js`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/server/src/controllers/authController.js):
  - Hashes passwords using `bcrypt.genSalt(10)` and `bcrypt.hash`.
  - Signs JWT tokens with 24-hour expiration.
  - Sends tokens via secure `httpOnly` cookie and JSON payload.
  - Role assignment rules: first user or `admin@flowforge.dev` becomes `admin`; all other registrations strictly receive `user` role.
- [`server/src/middleware/authMiddleware.js`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/server/src/middleware/authMiddleware.js):
  - `verifyToken`: Extracts and validates JWT from cookie or `Authorization: Bearer <token>`.
  - `requireRole`: Enforces role-based permissions (`admin` vs `user`).
- [`server/src/controllers/issueController.js`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/server/src/controllers/issueController.js):
  - In `deleteIssue` & `updateIssue`: Regular users can only modify issues they personally created (`issue.createdBy === req.user.id`). Admins can modify/delete any issue.
- [`client/src/components/ProtectedRoute.jsx`](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/client/src/components/ProtectedRoute.jsx): Enforces frontend route guards, redirecting unauthenticated users to `/login`.

### 2. How to Demonstrate in Class
1. **Password Hashing Demo**:
   - Check MongoDB or `server/test-server.js` output: User passwords are stored as bcrypt hashes (`$2a$10$...`), never plaintext.
2. **Privilege Escalation Prevention**:
   - Register a new user and inspect their role: Even if someone maliciously sends `{ role: 'admin' }` in the POST body, `validateMiddleware.js` deletes the field, guaranteeing standard users cannot make themselves admin.
3. **Role-Based Authorization (RBAC)**:
   - Log in with **Admin** (`admin@flowforge.dev` / `admin123`): You can delete or edit any issue across all users.
   - Log in with a **Regular User**: You can only edit or delete issues that you created. The UI renders "Read Only" on issues reported by others, and the backend returns `403 Forbidden` if an unauthorized modification is attempted.
4. **Protected Route Rejection**:
   - Copy `http://localhost:5173/dashboard`, log out, and paste the URL in an incognito window: You are immediately redirected to `/login`.

### 3. Likely Viva Questions & Answers
- **Q: What is a JWT and how does it work?**
  *A:* A JSON Web Token consists of three parts: Header (algorithm), Payload (claims like userId and role), and Signature. The server signs the token using a secret key. When a request arrives, the server verifies the cryptographic signature without needing to store session state in server memory (stateless authentication).
- **Q: Why use `httpOnly` cookies for JWT storage?**
  *A:* `httpOnly` cookies cannot be accessed or read by JavaScript code (`document.cookie`), which protects authentication tokens against theft via Cross-Site Scripting (XSS) attacks.
- **Q: What is the difference between Authentication and Authorization?**
  *A:* **Authentication** verifies *who* the user is (e.g. validating email and password). **Authorization** determines *what* permissions the authenticated user has (e.g. allowing an `admin` to delete any issue, while restricting regular `users` to their own issues).
