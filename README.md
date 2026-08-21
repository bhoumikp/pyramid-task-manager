# Pyramid — Task Management Platform

A modern, full-stack task and project management application designed to help teams organize projects, manage tasks, collaborate, and track progress from a single workspace.

Built with **Next.js, React, NestJS, PostgreSQL, and Prisma**, Pyramid combines a clean productivity-focused interface with a structured backend API and persistent workspace data.

---

## ✨ Features

### 📋 Task Management

* Create, edit, and delete tasks
* Kanban-style task board
* Drag-and-drop task status management
* Task statuses:

  * TODO
  * DOING
  * COMPLETED
  * ON HOLD
* Task priorities:

  * NONE
  * URGENT
  * HIGH
  * MEDIUM
  * LOW
* Start dates and due dates
* Task descriptions
* Labels
* Task assignment
* Private tasks
* Task watchers

### 📁 Project Management

* Create and manage projects
* Assign project leads
* Project descriptions
* Project status tracking
* Project priorities
* Project start and due dates
* Associate tasks with projects
* Project filtering and search

### 🔎 Search & Filtering

* Search tasks and projects
* Filter by priority
* Filter by assignee / project lead
* Filter by due date
* Customizable visible fields

### 💬 Collaboration

* Task comments
* Comment deletion
* Subtasks
* Subtask assignment
* Task activity tracking
* Workspace members

### 🔐 Authentication

* Guest authentication
* Google OAuth authentication
* JWT-based authentication
* HTTP-only authentication cookies
* Protected API routes
* User profile management
* Workspace membership

### 🎨 User Experience

* Responsive interface
* Dark/light theme support
* Modern component-based UI
* Keyboard-friendly interactions
* Mobile-friendly layouts
* Clean navigation and breadcrumbs
* Reusable UI components
* Custom Pyramid branding

---

## 🏗️ Architecture

Pyramid uses a separated frontend/backend architecture:

```text
┌──────────────────────────────────────────────┐
│                    User                      │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                  Next.js                     │
│              Frontend / UI                   │
│                                              │
│  React • TypeScript • Tailwind • dnd-kit     │
└──────────────────────┬───────────────────────┘
                       │
                       │ REST API
                       │ HTTP + Cookies
                       ▼
┌──────────────────────────────────────────────┐
│                  NestJS                      │
│                Backend API                   │
│                                              │
│  Authentication • Tasks • Projects           │
│  Comments • Subtasks • Workspace             │
└──────────────────────┬───────────────────────┘
                       │
                       │ Prisma ORM
                       ▼
┌──────────────────────────────────────────────┐
│                PostgreSQL                    │
│                                              │
│ Users • Workspaces • Projects • Tasks        │
│ Subtasks • Comments • Activities             │
└──────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

| Technology      | Purpose                    |
| --------------- | -------------------------- |
| Next.js 16      | React framework            |
| React 19        | UI development             |
| TypeScript      | Type-safe development      |
| Tailwind CSS    | Styling                    |
| dnd-kit         | Drag-and-drop interactions |
| React Hook Form | Form management            |
| Zod             | Validation                 |
| Lucide React    | Icons                      |
| next-themes     | Theme management           |
| date-fns        | Date handling              |

### Backend

| Technology       | Purpose                       |
| ---------------- | ----------------------------- |
| NestJS 11        | REST API framework            |
| TypeScript       | Type-safe backend development |
| Prisma 7         | ORM and database access       |
| PostgreSQL       | Relational database           |
| Passport         | Authentication                |
| Google OAuth 2.0 | Social authentication         |
| JWT              | Session authentication        |
| class-validator  | Request validation            |
| cookie-parser    | Authentication cookies        |

### Infrastructure

| Service | Purpose             |
| ------- | ------------------- |
| Vercel  | Frontend deployment |
| Render  | Backend deployment  |
| Neon    | PostgreSQL hosting  |
| GitHub  | Source control      |

---

## 📂 Project Structure

```text
pyramid-task-manager/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── prisma.config.ts
│   │
│   ├── src/
│   │   ├── auth/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── prisma/
│   │   ├── generated/
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── test/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── (app)/
│   │   ├── (auth)/
│   │   └── (settings)/
│   │
│   ├── components/
│   │   ├── app/
│   │   ├── auth/
│   │   ├── brand/
│   │   ├── projects/
│   │   ├── settings/
│   │   ├── sidebar/
│   │   ├── tasks/
│   │   └── ui/
│   │
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   └── decisions/
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js 20+
* npm
* PostgreSQL
* Git

You will also need:

* A Google OAuth application if Google login is enabled
* A PostgreSQL database
* Environment variables configured for both applications

---

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd pyramid-task-manager
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3. Configure Backend Environment Variables

Create:

```text
backend/.env
```

Example:

```env
PORT=4000
NODE_ENV=development

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_secure_jwt_secret

FRONTEND_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback
```

Never commit `.env` files or production secrets to source control.

---

## 4. Set Up the Database

From the `backend` directory:

```bash
npx prisma generate
```

Apply existing migrations:

```bash
npx prisma migrate deploy
```

For local development, when creating a new schema migration:

```bash
npx prisma migrate dev --name your_migration_name
```

---

## 5. Start the Backend

Development mode:

```bash
npm run start:dev
```

The API will run on:

```text
http://localhost:4000
```

The API prefix is:

```text
/api
```

So endpoints are available under:

```text
http://localhost:4000/api
```

---

## 6. Install Frontend Dependencies

Open a second terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 7. Start the Frontend

```bash
npm run dev
```

Open the application in your browser at:

```text
http://localhost:3000
```

---

## 🔐 Authentication

Pyramid supports two authentication methods.

### Guest Authentication

Users can enter the application using the guest login option without creating a traditional account.

A persistent user/workspace relationship is created on the backend so application data can be stored normally.

### Google OAuth

Users can authenticate using Google.

The authentication flow is:

```text
User
  │
  ▼
Google OAuth
  │
  ▼
NestJS callback
  │
  ▼
User validation / creation
  │
  ▼
JWT generation
  │
  ▼
HTTP-only cookie
  │
  ▼
Authenticated application
```

The JWT is stored in an HTTP-only cookie rather than browser-accessible JavaScript storage.

---

## 🔌 API Overview

The backend exposes RESTful endpoints grouped by feature.

### Authentication

```text
POST   /api/auth/guest
GET    /api/auth/google
GET    /api/auth/google/callback
GET    /api/auth/me
PATCH  /api/auth/me
POST   /api/auth/logout
POST   /api/auth/leave-workspace
```

### Projects

```text
GET    /api/projects
GET    /api/projects/:id
POST   /api/projects
PATCH  /api/projects/:id
DELETE /api/projects/:id
```

### Tasks

```text
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PATCH  /api/tasks/:id
```

### Task Collaboration

```text
GET    /api/tasks/members

POST   /api/tasks/:id/watch

POST   /api/tasks/:id/subtasks
PATCH  /api/tasks/:id/subtasks/:subtaskId
DELETE /api/tasks/:id/subtasks/:subtaskId

POST   /api/tasks/:id/comments
DELETE /api/tasks/:id/comments/:commentId
```

All task and project routes are protected by JWT authentication.

---

## 🗄️ Data Model

The application uses PostgreSQL with Prisma.

Core entities include:

```text
User
 │
 ├── WorkspaceMembership
 ├── Tasks
 ├── Projects
 ├── Comments
 └── Task Activities

Workspace
 │
 ├── Members
 ├── Projects
 └── Tasks

Project
 │
 └── Tasks

Task
 │
 ├── Subtasks
 ├── Comments
 ├── Watchers
 └── Activities
```

The database schema also supports relationships for:

* Task creators
* Task assignees
* Project creators
* Project leads
* Workspace members
* Subtask assignees
* Comment authors
* Task watchers
* Task activity actors

---

## 🧪 Testing

### Backend Unit Tests

```bash
cd backend
npm run test
```

### Test Coverage

```bash
npm run test:cov
```

### End-to-End Tests

```bash
npm run test:e2e
```

### Frontend Build Verification

```bash
cd frontend
npm run build
```

---

## 🏭 Production Build

### Backend

```bash
cd backend

npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
npm run start:prod
```

### Frontend

```bash
cd frontend

npm ci
npm run build
npm start
```

---

## ☁️ Deployment

The recommended production architecture is:

```text
GitHub
   │
   ├──────────────► Vercel
   │                 │
   │                 │ Next.js
   │                 ▼
   │              Frontend
   │                 │
   │                 │ HTTPS API
   │                 ▼
   └──────────────► Render
                     │
                     │ NestJS + Prisma
                     ▼
                   Neon
                     │
                     ▼
                 PostgreSQL
```

### Frontend — Vercel

Set the frontend root directory to:

```text
frontend
```

Environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain/api
```

Build command:

```bash
npm run build
```

### Backend — Render

Set the backend root directory to:

```text
backend
```

Build command:

```bash
npm ci && npx prisma generate && npx prisma migrate deploy && npm run build
```

Start command:

```bash
npm run start:prod
```

Backend environment variables:

```env
PORT=10000
NODE_ENV=production

DATABASE_URL=your_production_database_url

JWT_SECRET=your_production_jwt_secret

FRONTEND_URL=https://your-frontend-domain

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-frontend-domain/api/auth/google/callback
```

### Database — Neon

Use the PostgreSQL connection string provided by your Neon project as:

```env
DATABASE_URL=...
```

Production migrations should be applied with:

```bash
npx prisma migrate deploy
```

---

## 🔒 Security

The application follows several security practices:

* JWT authentication
* HTTP-only authentication cookies
* Protected backend routes
* Environment-based secrets
* Server-side authentication validation
* Request validation using `class-validator`
* Prisma parameterized database access
* Workspace-scoped data access
* Cascade and `SetNull` relationship handling where appropriate

### Environment Variables

Never commit:

```text
.env
.env.local
.env.production
```

to Git.

Production secrets should be stored in the deployment platform's environment variable manager.

---

## 🎯 Design Goals

Pyramid was designed around a few core principles:

### Simplicity

Common project and task actions should require minimal interaction.

### Visibility

Users should be able to quickly understand:

* What needs to be done
* What is currently being worked on
* What has been completed
* Who owns a task
* When something is due

### Collaboration

Tasks are treated as collaborative objects with:

* Assignees
* Watchers
* Comments
* Subtasks
* Activity history

### Persistence

Application state is stored in PostgreSQL rather than relying solely on client-side state.

### Type Safety

TypeScript is used across both the frontend and backend to reduce runtime errors and keep contracts explicit.

---

## 🧩 Key Technical Decisions

### PostgreSQL

A relational database was selected because Pyramid contains strongly related entities such as users, workspaces, projects, tasks, comments, subtasks, and memberships.

### Prisma

Prisma provides a type-safe database layer and simplifies schema migrations and relational queries.

### NestJS

NestJS provides a structured backend architecture using modules, controllers, services, guards, DTOs, and dependency injection.

### Next.js

Next.js provides the application framework for the frontend while supporting modern React patterns and production deployment.

### dnd-kit

dnd-kit provides the drag-and-drop foundation used by the task board.

---

## 📈 Future Improvements

Potential future enhancements include:

* Real-time task updates
* Notifications
* Email notifications
* Advanced project analytics
* Calendar integrations
* File attachments
* Role-based workspace permissions
* Activity feed improvements
* Advanced task dependencies
* Recurring tasks
* Custom project views
* Automated reminders
* Improved offline support

---

## 👨‍💻 Development Philosophy

Pyramid is built as a modular full-stack application with a clear separation between presentation, business logic, authentication, persistence, and infrastructure.

The frontend focuses on user experience and interaction, while the backend provides authenticated, workspace-aware APIs backed by PostgreSQL.

This structure makes the application easier to extend as additional collaboration and productivity features are introduced.

---

## 📄 License

This project is currently intended as a portfolio / assignment project.

If you plan to distribute it publicly, add an appropriate open-source license and update this section accordingly.

---

## ⭐ Acknowledgements

Built using:

* Next.js
* React
* NestJS
* Prisma
* PostgreSQL
* dnd-kit
* Tailwind CSS
* Passport
* Google OAuth

---

**Pyramid — Plan. Organize. Execute.**
