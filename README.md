# 🏛️ UPSC EdTech Platform - Enterprise Unified Platform

An enterprise-grade, end-to-end EdTech preparation ecosystem designed for **UPSC Civil Services Examination (CSE)** and State PSCs. This unified codebase integrates both the **Web Client (React 19 + Vite)** and the **Mobile Client (Flutter 3.x)** under a single **Unified Production Backend (Node.js, Express, Neon PostgreSQL, Groq AI, Razorpay)**.

---

## 🌟 Executive Architecture Overview

```
                                  +------------------------------------+
                                  |         End-User Clients           |
                                  |                                    |
                                  |   [ Web Client ]   [ Mobile App ]  |
                                  |     React 19         Flutter 3.x   |
                                  +--------+-----------------+---------+
                                           |                 |
                                           |  REST API & JWT |
                                           v                 v
+----------------------------------------------------------------------------------------------------+
|                               UNIFIED ENTERPRISE BACKEND SERVICE                                   |
|                                     (Node.js / Express 5)                                          |
|                                                                                                    |
|  [ Auth & RBAC ]    [ Courses & Study ]    [ Practice Tests ]     [ Mains AI Evaluation ]          |
|  [ Live RSS News ]  [ Groq AI Mentor ]     [ Razorpay Orders ]    [ Classroom & Doubts ]           |
+----+--------------------+--------------------+--------------------+--------------------+-----------+
     |                    |                    |                    |                    |
     v                    v                    v                    v                    v
[ PostgreSQL Cloud ]  [ Groq AI ]       [ Razorpay ]         [ Nodemailer ]      [ RSS News Feeds ]
 Supabase / AWS / Neon LLaMA-3.3-70B    Payments Gateway     Gmail Service       The Hindu / PIB
```

---

## ☁️ Production Cloud Database Setup (Supabase & Any PostgreSQL)

The unified backend is **100% database-provider agnostic**. It works seamlessly out of the box with:
- **Supabase Cloud Database** (Recommended)
- **AWS RDS / Aurora PostgreSQL**
- **Google Cloud SQL**
- **Neon Cloud PostgreSQL**
- **Local / Self-Hosted PostgreSQL**

### ⚡ Connecting to Supabase in 2 Minutes:

#### Method 1: Using the Supabase Connection String (Recommended)
1. In your [Supabase Project Dashboard](https://supabase.com/dashboard), navigate to:
   **Project Settings** ➡️ **Database** ➡️ **Connection String** (URI).
2. Copy the URI and set it in `backend/.env`:
   ```env
   DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   DB_SCHEMA=public
   ```
3. Run migrations and seed data:
   ```bash
   cd backend
   npm run migrate
   npm run seed
   ```
   *All 20 tables will be automatically created and populated!*

#### Method 2: One-Click SQL Editor in Supabase Dashboard
1. Open the [Supabase Dashboard](https://supabase.com/dashboard) and go to **SQL Editor**.
2. Open [`supabase_schema.sql`](file:///c:/Users/Chinmay/Desktop/heliox_internship/integration/supabase_schema.sql) from this repository.
3. Paste the contents into the SQL Editor and click **Run**.
4. Open the **Table Editor** — all 20 tables and initial course/admin seed data will instantly appear live!

Both clients share the **exact same database, authentication, user accounts, and core feature sets**:
- **Single Sign-On (SSO)**: A student or administrator who signs up on the Flutter mobile app can immediately sign in on the React website, and vice-versa.
- **Unified Syllabus & Progress**: Study progress, completed lessons, and test attempts are synchronized in real time across web and mobile.
- **Enterprise-Grade Groq AI**: Integrated 24/7 AI Mentor for doubt clearance and rigorous UPSC Mains 10-mark answer evaluation.
- **Zero Mock Hacks / "No MVP"**: Production PostgreSQL database with 20 normalized tables, automated schema migrations, transaction-safe seeds, and complete error handling.

---

## 📁 Repository Directory Structure

```text
integration/
├── start-platform.bat             # ⚡ One-click Windows launcher (starts Backend & Web)
├── start-platform.sh              # ⚡ One-click Unix launcher (starts Backend & Web)
├── docker-compose.yml             # 🐳 Production container orchestration
├── backend/                       # 🚀 UNIFIED PRODUCTION BACKEND
│   ├── Dockerfile                 # Multi-stage optimized Node.js container
│   ├── src/
│   │   ├── config/env.js          # Central validated environment variables
│   │   ├── db/
│   │   │   ├── pool.js            # Neon PostgreSQL connection pool (with 'upsc' schema)
│   │   │   ├── migrate.js         # Automated DB table migrations (20 tables)
│   │   │   └── seed.js            # Comprehensive UPSC CSE sample content & questions
│   │   ├── middleware/
│   │   │   ├── authenticate.js    # JWT verification & RBAC (Student / Admin)
│   │   │   └── error-handler.js   # Production error handling & JSON formatting
│   │   ├── routes/
│   │   │   ├── admin.js           # Admin CMS, user management & platform statistics
│   │   │   ├── ai.js              # Groq AI UPSC Chat & doubt clearance
│   │   │   ├── auth.js            # Registration, login, Google OAuth, session termination
│   │   │   ├── classroom.js       # Secure video streaming, downloadable notes, live doubts
│   │   │   ├── courses.js         # Course catalog, lessons, subjects, and study progress
│   │   │   ├── current-affairs.js # Current affairs articles & live RSS parser
│   │   │   ├── health.js          # Service health monitoring endpoint
│   │   │   ├── mains.js           # Mains answer evaluation & faculty review queue
│   │   │   ├── payments.js        # Razorpay orders, signatures & subscriptions
│   │   │   ├── student.js         # Reminders, course reviews & analytics
│   │   │   └── tests.js           # Practice tests, multiple choice questions, attempts
│   │   ├── services/
│   │   │   ├── email.js           # Nodemailer welcome emails
│   │   │   ├── groq.js            # Groq SDK dynamic live model integration
│   │   │   ├── payment.js         # Razorpay client & HMAC SHA-256 verification
│   │   │   └── rss.js             # Live news feed parser (PIB / The Hindu)
│   │   ├── app.js                 # Central Express application configuration
│   │   └── server.js              # HTTP server bootstrapper
│   ├── .env                       # Pre-configured production secrets
│   └── package.json
│
├── web/                           # 🌐 REACT WEB APPLICATION
│   ├── src/
│   │   ├── api/axios.js           # Central Axios client connected to unified backend
│   │   ├── pages/                 # Full suite of UPSC Web Pages
│   │   │   ├── AdminDashboard.jsx # CMS & Faculty review console
│   │   │   ├── AIAssistant.jsx    # Live Groq AI UPSC Chatbot
│   │   │   ├── Classroom.jsx      # Video lectures & notes downloads
│   │   │   ├── CourseCatalog.jsx  # Courses & Razorpay checkout
│   │   │   ├── CourseDetail.jsx   # Course syllabus & instructor overview
│   │   │   ├── CurrentAffairs.jsx # Daily editorial & news feeds
│   │   │   ├── Home.jsx           # Student dashboard & study reminders
│   │   │   ├── LiveClass.jsx      # Interactive live class & doubts
│   │   │   ├── Login.jsx          # Login & registration portal
│   │   │   ├── MainsPractice.jsx  # Mains answer submission & AI evaluator
│   │   │   ├── MockTests.jsx      # Timed practice test simulator
│   │   │   └── Profile.jsx        # User analytics & preferences
│   ├── package.json
│   └── vite.config.js
│
├── mobile/                        # 📱 FLUTTER MOBILE APPLICATION
│   ├── lib/
│   │   ├── app/
│   │   │   ├── app.dart           # App root & unified repository wiring
│   │   │   ├── config/app_config.dart # Smart multi-platform backend URL resolver
│   │   │   └── router/app_router.dart # Declarative GoRouter routing
│   │   ├── features/
│   │   │   ├── authentication/    # Live API authentication (Login / Signup)
│   │   │   ├── ai_mentor/         # 🤖 24/7 Groq AI Mentor & Doubt Clearing (Live)
│   │   │   ├── study/             # Subjects, Courses, Lessons, and Progress
│   │   │   ├── tests/             # Practice Tests, Attempt Engine & Results
│   │   │   ├── current_affairs/   # Live Current Affairs articles
│   │   │   ├── study_material/    # Downloadable study notes & PDFs
│   │   │   ├── video_learning/    # Video masterclasses & streaming
│   │   │   ├── subscription/      # Subscription plans & active status
│   │   │   └── notes_bookmarks/   # Personal notes and bookmarked topics
│   ├── test/                      # 33 Unit and Widget Tests (100% Passing)
│   └── pubspec.yaml
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ or v20+ installed
- **Flutter**: v3.13+ or v3.47+ installed (with Dart)
- **Git**

---

### 2. Run the Unified Backend

```bash
cd backend

# Install dependencies (already prepared)
npm install

# Run database migrations (sets up all 20 tables in NeonDB)
npm run migrate

# Seed database with sample UPSC courses, questions, and notes
npm run seed

# Start the unified backend server
npm start
```
> The backend server starts live on `http://localhost:3000`.
> Health check is accessible at `http://localhost:3000/api/health`.

---

### 3. Run the React Web Client

```bash
cd web

# Start development server
npm run dev
```
> Web application opens at `http://localhost:5173`.
> You can also run `npm run build` to create an optimized production build (`dist/`).

---

### 4. Run the Flutter Mobile Client

```bash
cd mobile

# Verify dependencies
flutter pub get

# Run tests
flutter test

# Run app on connected device / emulator / Chrome / Windows desktop:
flutter run
```
> **Platform URL Resolution**:
> - On Android Emulator: Automatically connects to `http://10.0.2.2:3000`.
> - On Web / Windows / macOS / iOS Simulator: Automatically connects to `http://localhost:3000`.
> - Custom host override: `flutter run --dart-define=API_BASE_URL=https://api.yourdomain.com`

---

## 🔑 Default Credentials (Ready for Client Demo)

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Platform Administrator** | `admin@upscplatform.com` | `Admin@UPSC2026` | Full Admin Dashboard, CMS Management, User Management, Mains Answer Grading |
| **Verified Student** | `student@upscplatform.com` | `Student@2026` | Enrolled Courses, Practice Tests, Progress Tracking, AI Mentorship |

---

## 📡 Complete Unified API Reference

All endpoints return standardized JSON responses.

### 🛡️ Authentication & User Accounts
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` (or `/api/v1/auth/signup`) | Register new student account | None |
| `POST` | `/api/auth/login` (or `/api/v1/auth/login`) | Sign in user and receive JWT | None |
| `POST` | `/api/auth/google` (or `/api/v1/auth/google`) | Sign in or register with Google OAuth | None |
| `GET` | `/api/auth/me` (or `/api/v1/auth/me`) | Retrieve authenticated user profile | Bearer Token |
| `POST` | `/api/send-welcome-email` | Send transactional welcome email | None |

### 📚 Courses & Study Syllabus
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/courses` | List all available courses (React Web) | None |
| `GET` | `/api/courses/:id` | Get course details by ID or slug | None |
| `GET` | `/api/study/subjects` | List study subjects / syllabus categories | None |
| `GET` | `/api/study/courses` | List study courses (Flutter Mobile) | Optional |
| `GET` | `/api/study/courses/:id/lessons` | List all lessons with rich notes for a course | Optional |
| `GET` | `/api/study/lessons/:id` | Read individual lesson content & notes | Optional |
| `GET` | `/api/study/progress` | Get list of completed lesson IDs | Bearer Token |
| `POST` | `/api/study/lessons/:id/progress` | Mark lesson as complete or incomplete | Bearer Token |

### 📝 Mock Tests & Assessment Engine
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tests` (or `/api/v1/tests`) | List published practice tests | None |
| `GET` | `/api/tests/:id` | Get test details with all questions and options | None |
| `POST` | `/api/tests/:id/attempt` | Submit test answers, compute score & accuracy | Optional |
| `GET` | `/api/tests/attempts/me` | Retrieve student's past test attempts | Bearer Token |

### 📰 Current Affairs & Live News Feeds
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/current-affairs` | Get verified editorial articles + live RSS feeds | None |
| `GET` | `/api/current-affairs/:id` | Get detailed article content | None |

### 🤖 Groq AI Academic Mentor & Mains Evaluator
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/chat` | Multi-turn conversation with UPSC AI Mentor | Optional |
| `POST` | `/api/ai/ask-doubt` | Quick academic doubt clearance | Optional |
| `POST` | `/api/mains/evaluate` | AI scoring & breakdown of Mains 10-mark answers | None |
| `POST` | `/api/mains/submit-to-admin` | Submit answer for manual faculty review | Optional |
| `GET` | `/api/admin/mains-submissions` | Admin list of student Mains submissions | Admin Only |
| `POST` | `/api/admin/mains-evaluate/:id` | Admin evaluation, score & detailed feedback | Admin Only |

### 💳 Payments, Orders & Subscriptions
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/payment/create-order` | Create Razorpay order | Optional |
| `POST` | `/api/v1/payment/verify` | Verify payment signature & activate course | Optional |
| `GET` | `/api/v1/orders` | Retrieve authenticated student's orders | Bearer Token |
| `GET` | `/api/subscriptions/plans` | List active subscription tiers | None |
| `GET` | `/api/subscriptions/me` | Get student's current active subscription | Bearer Token |

### 🎓 Classroom, Live Class & Doubts
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/videos/secure-playback/:id` | Obtain secure video playback token | Optional |
| `GET` | `/api/v1/downloads/notes` | List downloadable study materials & PDFs | None |
| `GET` | `/api/v1/live-classes/:id/chat` | Fetch real-time live class chat messages | None |
| `POST` | `/api/v1/live-classes/:id/chat` | Post message to live class chat | Optional |
| `POST` | `/api/v1/live-classes/:id/doubts` | Post student doubt to instructor | Optional |

### ⚙️ Administration & CMS
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | List all registered users and roles | Admin Only |
| `PUT` | `/api/admin/users/:id` | Update user role or active status | Admin Only |
| `GET` | `/api/cms/content` | Fetch live home page CMS content | None |
| `PUT` | `/api/admin/cms/home` | Update homepage banner and text CMS | Admin Only |
| `POST` | `/api/admin/cms/courses` | Create new course via CMS | Admin Only |
| `POST` | `/api/admin/cms/mock-tests` | Create new practice test via CMS | Admin Only |
| `GET` | `/api/v1/admin/dashboard-data` | High-level platform statistics & KPIs | Admin Only |

---

## 🧪 Verification & Testing Status

- [x] **Database Schema**: 20 normalized tables in NeonDB PostgreSQL verified.
- [x] **Backend Integration**: All 30+ endpoints tested and verified live with 200 OK responses.
- [x] **Flutter Mobile Test Suite**: 33 of 33 tests passing (`flutter test` exited with code 0).
- [x] **React Web Production Build**: Vite production build succeeded (`npm run build` exited with code 0).
- [x] **Cross-Platform Compatibility**: Android emulator loopback (`10.0.2.2`), web desktop (`localhost`), and custom production host resolution supported.
