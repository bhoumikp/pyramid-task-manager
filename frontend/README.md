# Pyramid Frontend

The Pyramid frontend is a **Next.js 16 + React 19** application providing the user interface for task management, project management, workspace collaboration, and authentication.

The frontend communicates with the NestJS backend through REST APIs and sends authentication cookies with API requests.

---

## 🛠️ Stack

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* dnd-kit
* React Hook Form
* Zod
* Lucide React
* next-themes
* date-fns
* shadcn / Base UI components

---

## 📁 Structure

```text
frontend/
│
├── app/
│   ├── (app)/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── (settings)/
│   │   └── layout.tsx
│   │
│   ├── globals.css
│   └── layout.tsx
│
├── components/
│   ├── app/
│   ├── auth/
│   ├── brand/
│   ├── projects/
│   ├── providers/
│   ├── settings/
│   ├── sidebar/
│   ├── tasks/
│   └── ui/
│
├── contexts/
│   ├── breadcrumb-context.tsx
│   ├── projects-context.tsx
│   └── tasks-context.tsx
│
├── hooks/
│   ├── use-breadcrumbs.ts
│   ├── use-mobile.ts
│   ├── use-projects.ts
│   └── use-tasks.ts
│
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   ├── projects.ts
│   ├── tasks.ts
│   └── utils.ts
│
├── public/
├── package.json
└── README.md
```

---

## 🧭 Application Areas

The frontend is organized into several functional areas.

### Task Workspace

The task workspace provides:

* Task board
* Task list
* Task table
* Task creation
* Task editing
* Task status management
* Drag-and-drop
* Task filtering
* Task search
* Task details

### Projects

The project area provides:

* Project list
* Project creation
* Project editing
* Project deletion
* Project filtering
* Project leads
* Project dates
* Project status
* Project priority
* Project-linked tasks

### Settings

Settings include:

* User profile
* Account information
* Workspace actions
* Settings navigation

### Authentication

The login interface supports:

* Guest login
* Google authentication

---

## 🧱 Component Architecture

Reusable UI components are separated from feature-specific components.

```text
components/
│
├── ui/
│   └── Reusable primitives
│
├── tasks/
│   └── Task-specific components
│
├── projects/
│   └── Project-specific components
│
├── auth/
│   └── Authentication UI
│
├── settings/
│   └── Settings UI
│
├── sidebar/
│   └── Application navigation
│
├── app/
│   └── Shared application controls
│
└── brand/
    └── Pyramid branding
```

This keeps generic UI components independent from application-specific business logic.

---

## 🧠 State Management

The application uses React Context for shared task and project state.

### Tasks Context

`contexts/tasks-context.tsx` manages task-related application state including:

* Tasks
* Loading state
* Search
* Priority filters
* Assignee filters
* Due-date filters
* Visible fields
* Task creation
* Task updates
* Task deletion

### Projects Context

`contexts/projects-context.tsx` manages:

* Projects
* Workspace members
* Current user
* Project search
* Priority filters
* Lead filters
* Due-date filters
* Visible project fields
* Project creation
* Project updates
* Project deletion

---

## 🔌 API Integration

API communication is centralized in:

```text
lib/api.ts
```

The API base URL is controlled through:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

In production:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain/api
```

Authenticated requests use:

```ts
credentials: "include"
```

This allows the browser to send the backend's authentication cookie with API requests.

---

## 📋 Task Model

The frontend task model supports:

```text
Task
├── title
├── description
├── status
├── priority
├── startDate
├── dueDate
├── labels
├── isPrivate
├── projectId
├── assignee
├── createdBy
├── watchers
├── subtasks
├── comments
└── activities
```

### Statuses

```text
TODO
DOING
COMPLETED
ON_HOLD
```

### Priorities

```text
NONE
URGENT
HIGH
MEDIUM
LOW
```

---

## 📁 Project Model

Projects contain:

```text
Project
├── id
├── title
├── description
├── status
├── priority
├── lead
├── startDate
├── dueDate
└── createdAt
```

Project statuses:

```text
PLANNING
IN_PROGRESS
COMPLETED
ON_HOLD
```

---

## 🖱️ Drag & Drop

The task board uses **dnd-kit**.

The task board is organized into status columns:

```text
┌──────────┐ ┌──────────┐ ┌────────────┐ ┌──────────┐
│  To Do   │ │  Doing   │ │ Completed  │ │ On Hold  │
├──────────┤ ├──────────┤ ├────────────┤ ├──────────┤
│ Task 1   │ │ Task 3   │ │ Task 5     │ │ Task 7   │
│ Task 2   │ │ Task 4   │ │ Task 6     │ │ Task 8   │
└──────────┘ └──────────┘ └────────────┘ └──────────┘
```

Dragging a task between columns updates its status and synchronizes the change with the backend.

---

## 🔎 Search & Filters

The task and project interfaces support multiple filters.

### Tasks

* Status
* Priority
* Members
* Due date
* Labels
* Reporter

### Projects

* Priority
* Lead
* Due date

The visible-field controls allow users to customize which columns or properties are displayed.

---

## 🔐 Authentication

Authentication is handled by the backend.

The frontend calls:

```text
POST /api/auth/guest
```

for guest login.

Google authentication is initiated through the backend OAuth flow.

After authentication, the backend stores the JWT in an HTTP-only cookie.

The frontend does not directly store the JWT in localStorage.

---

## 🌎 Environment Variables

Create:

```text
frontend/.env.local
```

For local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

For production:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain/api
```

Only variables prefixed with `NEXT_PUBLIC_` are exposed to browser-side code.

Do not put secrets in frontend environment variables.

---

## 🚀 Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🏭 Production Build

Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Run linting:

```bash
npm run lint
```

---

## ☁️ Vercel Deployment

The frontend can be deployed as a Vercel project.

### Root Directory

```text
frontend
```

### Build Command

```bash
npm run build
```

### Environment Variable

```text
NEXT_PUBLIC_API_URL
```

Example:

```text
https://your-backend-domain/api
```

After deployment, verify that:

* The frontend can reach the backend.
* API requests include credentials.
* Guest login works.
* Google authentication redirects correctly.
* Tasks load from PostgreSQL.
* Drag-and-drop updates persist.
* Project changes persist after refreshing the page.

---

## 🎨 UI & Design

The interface uses a reusable component system with:

* Buttons
* Inputs
* Dialogs
* Dropdowns
* Select controls
* Tables
* Cards
* Badges
* Calendars
* Avatars
* Tooltips
* Sidebars
* Responsive sheets

Application-specific components are composed from these reusable primitives.

The Pyramid brand is implemented in:

```text
components/brand/pyramid-logo.tsx
```

---

## 📱 Responsive Design

The frontend supports responsive layouts for different screen sizes.

Mobile-specific behavior is handled through reusable hooks and responsive UI primitives.

The application navigation adapts between desktop sidebar navigation and mobile sheet-based navigation.

---

## 🧪 Verification

Before submitting or deploying the frontend, run:

```bash
npm run lint
npm run build
```

A successful production build confirms that:

* TypeScript passes
* Next.js compilation succeeds
* Routes can be generated
* Production assets can be created

---

## 🧭 Development Guidelines

When adding a new feature:

1. Define its data types in `lib/`.
2. Add API functions in `lib/api.ts`.
3. Add shared state to an appropriate context when necessary.
4. Create feature-specific components.
5. Reuse primitives from `components/ui`.
6. Keep backend communication out of presentational components when possible.
7. Run linting and a production build before committing.

---

## 📌 Important

The frontend should never contain:

* Database credentials
* JWT secrets
* Google OAuth client secrets
* Backend private keys
* Other server-side secrets

Only the public backend API URL should be exposed through `NEXT_PUBLIC_API_URL`.

---

## License

The frontend is part of the Pyramid project and is currently intended as an assignment / portfolio application.
