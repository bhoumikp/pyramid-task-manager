# Pyramid Backend

The Pyramid backend is a **NestJS 11 REST API** responsible for authentication, workspace access, projects, tasks, subtasks, comments, task activity, and database persistence.

It uses **Prisma 7** as the ORM and **PostgreSQL** as the database.

---

## 🛠️ Stack

* NestJS 11
* TypeScript
* Prisma 7
* PostgreSQL
* Passport
* Google OAuth 2.0
* JWT
* class-validator
* class-transformer
* cookie-parser
* Jest

---

## 📁 Structure

```text
backend/
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── prisma.config.ts
│
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── google.strategy.ts
│   │   ├── jwt.strategy.ts
│   │   ├── jwt-auth.guard.ts
│   │   └── current-user.decorator.ts
│   │
│   ├── projects/
│   │   ├── dto/
│   │   ├── projects.controller.ts
│   │   ├── projects.service.ts
│   │   └── projects.module.ts
│   │
│   ├── tasks/
│   │   ├── dto/
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   └── tasks.module.ts
│   │
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── generated/
│   │   └── prisma/
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── package.json
└── README.md
```

---

## 🧩 Modules

### Authentication

Responsible for:

* Guest authentication
* Google OAuth
* JWT generation
* JWT validation
* Current-user lookup
* Profile updates
* Logout
* Workspace leaving

Main files:

```text
src/auth/
├── auth.controller.ts
├── auth.service.ts
├── auth.module.ts
├── google.strategy.ts
├── jwt.strategy.ts
└── jwt-auth.guard.ts
```

### Projects

Responsible for:

* Project creation
* Project retrieval
* Project updates
* Project deletion
* Project leads
* Project status
* Project priority
* Project dates

### Tasks

Responsible for:

* Task creation
* Task retrieval
* Task updates
* Task assignment
* Task priority/status
* Watchers
* Subtasks
* Comments
* Activity records
* Workspace member lookup

### Prisma

Provides the database client and shared database service.

---

## 🔐 Authentication

Authentication uses JWTs stored in an HTTP-only cookie named:

```text
access_token
```

The JWT payload contains the authenticated user's ID:

```json
{
  "sub": "user-id"
}
```

The JWT strategy extracts the token from the request cookie.

Protected routes use:

```ts
@UseGuards(JwtAuthGuard)
```

The current user can then be accessed through the custom:

```ts
@CurrentUser()
```

decorator.

---

## 🔑 Environment Variables

Create:

```text
.env
```

Example:

```env
NODE_ENV=development
PORT=4000

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_secure_jwt_secret

FRONTEND_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback
```

### Production

For production, configure these values through the hosting provider rather than committing them to Git.

Typical production values:

```env
NODE_ENV=production
PORT=10000

DATABASE_URL=your_production_postgresql_url

JWT_SECRET=your_production_secret

FRONTEND_URL=https://your-frontend-domain

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-frontend-domain/api/auth/google/callback
```

---

## 🗄️ Prisma

Generate Prisma Client:

```bash
npx prisma generate
```

Check migration status:

```bash
npx prisma migrate status
```

Apply existing migrations:

```bash
npx prisma migrate deploy
```

During local schema development:

```bash
npx prisma migrate dev --name migration_name
```

The production environment should use:

```bash
npx prisma migrate deploy
```

rather than `migrate dev`.

---

## 🌐 API

The application uses a global `/api` prefix.

### Authentication

```text
GET    /api/auth/google
GET    /api/auth/google/callback
POST   /api/auth/guest
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
GET    /api/tasks/members
GET    /api/tasks/:id
POST   /api/tasks
PATCH  /api/tasks/:id
```

### Watchers

```text
POST   /api/tasks/:id/watch
```

### Subtasks

```text
POST   /api/tasks/:id/subtasks
PATCH  /api/tasks/:id/subtasks/:subtaskId
DELETE /api/tasks/:id/subtasks/:subtaskId
```

### Comments

```text
POST   /api/tasks/:id/comments
DELETE /api/tasks/:id/comments/:commentId
```

All endpoints that access protected workspace data require a valid JWT cookie.

---

## 🗃️ Database Models

The Prisma schema contains the following core models:

```text
User
Workspace
WorkspaceMember
Project
Task
Subtask
Comment
TaskActivity
```

Enums include:

```text
AuthProvider
ProjectStatus
TaskStatus
TaskPriority
```

---

## 🚀 Local Development

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npx prisma generate
```

Apply migrations:

```bash
npx prisma migrate deploy
```

Start in development mode:

```bash
npm run start:dev
```

The API runs on:

```text
http://localhost:4000
```

---

## 🏭 Production Build

Build:

```bash
npm run build
```

Start:

```bash
npm run start:prod
```

Before starting production, make sure:

* `DATABASE_URL` points to the production database.
* Prisma Client has been generated.
* Database migrations have been applied.
* `JWT_SECRET` is configured.
* `FRONTEND_URL` matches the deployed frontend.
* Google OAuth production credentials are configured when Google login is enabled.

---

## 🧪 Testing

Run unit tests:

```bash
npm run test
```

Watch tests:

```bash
npm run test:watch
```

Coverage:

```bash
npm run test:cov
```

End-to-end tests:

```bash
npm run test:e2e
```

---

## ☁️ Render Deployment

The backend can be deployed as a Render Web Service.

### Root Directory

```text
backend
```

### Build Command

```bash
npm ci && npx prisma generate && npx prisma migrate deploy && npm run build
```

### Start Command

```bash
npm run start:prod
```

### Required Environment Variables

```text
NODE_ENV
PORT
DATABASE_URL
JWT_SECRET
FRONTEND_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL
```

---

## 🔒 Security Considerations

* Never commit `.env` files.
* Never expose `JWT_SECRET` to the frontend.
* Never expose `GOOGLE_CLIENT_SECRET` to the frontend.
* Authentication tokens are stored in HTTP-only cookies.
* Protected routes use `JwtAuthGuard`.
* Request validation is enabled globally.
* Database access is performed through Prisma.

---

## 🔄 Backend Request Flow

A typical authenticated task request follows this path:

```text
HTTP Request
     │
     ▼
NestJS Controller
     │
     ▼
JwtAuthGuard
     │
     ▼
JWT Strategy
     │
     ▼
Current User
     │
     ▼
Controller
     │
     ▼
Service
     │
     ▼
Prisma
     │
     ▼
PostgreSQL
```

This separation keeps authentication, HTTP handling, business logic, and persistence independently structured.

---

## 🧭 Development Guidelines

When adding a backend feature:

1. Define or update the Prisma model if persistence is required.
2. Create a migration.
3. Add/update the relevant DTO.
4. Add service logic.
5. Add controller endpoints.
6. Add authentication guards where required.
7. Add tests.
8. Update this README when the public API changes.

---

## License

The backend is part of the Pyramid project and is currently intended as an assignment / portfolio application.
