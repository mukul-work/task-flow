# Trello Clone (Kanban App)

A full-stack **Kanban task management application** inspired by Trello.

This repository is structured like a production-style app:

- Next.js App Router UI
- Route handler APIs
- MongoDB integration
- Models/services/utilities separated by responsibility

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- MongoDB (via the official `mongodb` driver)
- Auth helpers: JWT + bcrypt
- (Installed dependency, currently not used) Mongoose

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Configure environment variables

Create an env file (recommended: `.env.local`) with:

```bash
MONGODB_URI=your_mongodb_connection_string
```

If you use the auth helpers in `src/lib/auth.ts`, also set:

```bash
JWT_SECRET=your_long_random_secret
```

If you want NextAuth (Google + Credentials) authentication, also set:

```bash
NEXTAUTH_SECRET=your_long_random_secret
# Optional but recommended in dev
NEXTAUTH_URL=http://localhost:3000

# Enable "Sign in with Google" (OAuth)
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

Notes:

- This repo's `.gitignore` ignores `.env*`. Do not commit secrets.

3. Run the dev server

```bash
npm run dev
```

## Project Structure (Folder Architecture)

This tree excludes generated folders like `node_modules` and `.next`.

```text
.
├── .env
├── .gitignore
├── README.md
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── boards/
│   │   │   │   └── route.ts
│   │   │   ├── cards/
│   │   │   │   └── route.ts
│   │   │   ├── lists/
│   │   │   │   └── route.ts
│   │   │   └── test-db/
│   │   │       └── route.ts
│   │   ├── global.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── board/
│   │   │   ├── Board.tsx
│   │   │   └── BoardHeader.tsx
│   │   ├── card/
│   │   │   ├── Card.tsx
│   │   │   └── CardModal.tsx
│   │   ├── list/
│   │   │   └── ListColumn.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       └── Modal.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   └── mongodb.ts
│   ├── models/
│   │   ├── Board.ts
│   │   ├── Card.ts
│   │   ├── List.ts
│   │   └── User.ts
│   ├── services/
│   │   ├── boardService.ts
│   │   ├── cardService.ts
│   │   └── listService.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── helpers.ts
└── tsconfig.json
```

### What goes where

#### Root

- `next.config.ts` / `tsconfig.json` / `eslint.config.mjs` / `postcss.config.mjs`: Framework + tooling configuration.
- `public/`: Static assets served as-is.

#### `src/app/` (Next.js App Router)

- `layout.tsx`: Root layout for the application (document shell).
- `page.tsx`: Home page entry.
- `global.css`: Global styles.

#### `src/app/api/` (Route Handlers)

Each folder under `src/app/api/*/route.ts` maps to an HTTP endpoint:

- `api/boards/route.ts`: Boards endpoint (GET, POST).
- `api/lists/route.ts`: Lists endpoint (GET, POST).
- `api/cards/route.ts`: Cards endpoint (GET, POST, PATCH, DELETE).
- `api/test-db/route.ts`: DB connectivity check endpoint.

#### `src/components/`

UI is organized by domain:

- `components/board/`: Board-level components.
- `components/list/`: List/column components.
- `components/card/`: Card UI and related modal.
- `components/ui/`: Reusable primitives (buttons, modal wrapper).

Note: Several components are present as placeholders (empty files) and are intended to be implemented as the UI is built out.

#### `src/lib/`

- `mongodb.ts`: MongoDB client connection helper (uses `MONGODB_URI`).
- `auth.ts`: Auth utilities (bcrypt hashing + JWT token generation).

#### `src/models/`

MongoDB collection helpers (thin wrappers around `db.collection(...)`).

#### `src/services/`

Business-logic layer used by the API route handlers (MongoDB CRUD + queries).

#### `src/types/` and `src/utils/`

- `types/index.ts`: Shared TypeScript types for the app.
- `utils/helpers.ts`: Shared helper functions.

## Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - lint

## Backend API Docs

### Base URL

All backend routes are Next.js Route Handlers under `src/app/api/**/route.ts` and are served from:

- `/api/*`

### Data Model (current)

The app uses three MongoDB collections:

- `boards`
- `lists`
- `cards`
- `users`

Logical shapes used by the app (from `src/types/index.ts`):

**Board**

- `_id?: string`
- `title: string`
- `ownerId: string`
- `members?: string[]`
- `createdAt?: Date`

**List**

- `_id?: string`
- `boardId: string`
- `title: string`
- `order: number`
- `createdAt?: Date`

**Card**

- `_id?: string`
- `listId: string`
- `title: string`
- `description?: string`
- `order: number`
- `createdAt?: Date`

**User** (for auth)

- `_id?: string`
- `email: string`
- `name?: string`
- `image?: string`
- `provider?: "credentials" | "google"`
- `googleId?: string`
- `passwordHash?: string` (only for credentials users)
- `createdAt?: Date`

Notes:

- API responses are JSON; `Date` values serialize as ISO strings.
- MongoDB `_id` values may serialize as strings; treat them as opaque ids on the client.

### Endpoints (Summary)

| Method | Route                    | Purpose                       |
| ------ | ------------------------ | ----------------------------- |
| POST   | `/api/auth/signup`       | Create a credentials user     |
| POST   | `/api/auth/login`        | Login with email/password     |
| GET    | `/api/auth/providers`    | List NextAuth providers       |
| GET    | `/api/test-db`           | DB connectivity check         |
| GET    | `/api/boards?userId=...` | List boards owned by a user   |
| POST   | `/api/boards`            | Create a board                |
| GET    | `/api/lists?boardId=...` | List lists/columns in a board |
| POST   | `/api/lists`             | Create a list/column          |
| GET    | `/api/cards?listId=...`  | List cards in a list          |
| POST   | `/api/cards`             | Create a card                 |
| PATCH  | `/api/cards`             | Update a card                 |
| DELETE | `/api/cards?id=...`      | Delete a card                 |

### Endpoint Details

#### 0) Auth (Credentials + Google)

This repo supports **two auth styles**:

- **Simple JWT endpoints** for quick API testing: `POST /api/auth/signup`, `POST /api/auth/login`
- **NextAuth** for session-based auth and Google OAuth: `/api/auth/*` (served by NextAuth)

##### POST `/api/auth/signup`

**Method**: `POST`  
**Route**: `/api/auth/signup`

**Body (JSON)**

```json
{
  "email": "demo@example.com",
  "password": "password123",
  "name": "Demo User"
}
```

**Sample response (200)**

```json
{
  "user": {
    "id": "65f0b6b3a2c1a0b1b6f1d999",
    "email": "demo@example.com",
    "name": "Demo User",
    "provider": "credentials"
  },
  "token": "<jwt>"
}
```

##### POST `/api/auth/login`

**Method**: `POST`  
**Route**: `/api/auth/login`

**Body (JSON)**

```json
{
  "email": "demo@example.com",
  "password": "password123"
}
```

**Sample response (200)**

```json
{
  "user": {
    "id": "65f0b6b3a2c1a0b1b6f1d999",
    "email": "demo@example.com",
    "name": "Demo User",
    "provider": "credentials"
  },
  "token": "<jwt>"
}
```

##### NextAuth helper routes

- `GET /api/auth/providers` - lists configured providers (Credentials, and Google if env vars are set)
- `GET /api/auth/signin/google` - starts the Google OAuth flow (open in a browser)

#### 1) Test DB

**Method**: `GET`  
**Route**: `/api/test-db`

**Sample response (200)**

```json
{
  "message": "MongoDB connected",
  "collections": 3
}
```

Use this first when debugging backend issues (connection string, IP allowlist, cluster health).

#### 2) Boards

##### GET `/api/boards`

**Method**: `GET`  
**Route**: `/api/boards?userId=<string>`

**Query params**

- `userId` (string, required) - filters boards by `ownerId`

**Sample response (200)**

```json
[
  {
    "_id": "65f0b6b3a2c1a0b1b6f1d234",
    "title": "My Board",
    "ownerId": "user_123",
    "members": [],
    "createdAt": "2026-03-17T10:20:30.000Z"
  }
]
```

##### POST `/api/boards`

**Method**: `POST`  
**Route**: `/api/boards`

**Body (JSON)**

```json
{
  "title": "My Board",
  "ownerId": "user_123",
  "members": ["user_123"]
}
```

**Body types**

- `title`: string (required)
- `ownerId`: string (required)
- `members`: string[] (optional)

**Sample response (200)**

```json
{
  "_id": "65f0b6b3a2c1a0b1b6f1d234",
  "title": "My Board",
  "ownerId": "user_123",
  "members": ["user_123"],
  "createdAt": "2026-03-17T10:20:30.000Z"
}
```

#### 3) Lists

##### GET `/api/lists`

**Method**: `GET`  
**Route**: `/api/lists?boardId=<string>`

**Query params**

- `boardId` (string, required)

**Sample response (200)**

```json
[
  {
    "_id": "65f0b7dca2c1a0b1b6f1d235",
    "boardId": "65f0b6b3a2c1a0b1b6f1d234",
    "title": "To Do",
    "order": 1,
    "createdAt": "2026-03-17T10:22:00.000Z"
  }
]
```

##### POST `/api/lists`

**Method**: `POST`  
**Route**: `/api/lists`

**Body (JSON)**

```json
{
  "boardId": "65f0b6b3a2c1a0b1b6f1d234",
  "title": "To Do",
  "order": 1
}
```

**Body types**

- `boardId`: string (required)
- `title`: string (required)
- `order`: number (required)

**Response (current implementation)**

The current service returns MongoDB's `InsertOneResult` (not the created list object):

```json
{
  "acknowledged": true,
  "insertedId": "65f0b7dca2c1a0b1b6f1d235"
}
```

#### 4) Cards

##### GET `/api/cards`

**Method**: `GET`  
**Route**: `/api/cards?listId=<string>`

**Query params**

- `listId` (string, required)

**Sample response (200)**

```json
[
  {
    "_id": "65f0b8e4a2c1a0b1b6f1d236",
    "listId": "65f0b7dca2c1a0b1b6f1d235",
    "title": "First task",
    "description": "Optional details",
    "order": 1,
    "createdAt": "2026-03-17T10:25:00.000Z"
  }
]
```

##### POST `/api/cards`

**Method**: `POST`  
**Route**: `/api/cards`

**Body (JSON)**

```json
{
  "listId": "65f0b7dca2c1a0b1b6f1d235",
  "title": "First task",
  "description": "Optional details",
  "order": 1
}
```

**Body types**

- `listId`: string (required)
- `title`: string (required)
- `description`: string (optional)
- `order`: number (required)

**Response (current implementation)**

The current service returns MongoDB's `InsertOneResult` (not the created card object):

```json
{
  "acknowledged": true,
  "insertedId": "65f0b8e4a2c1a0b1b6f1d236"
}
```

##### PATCH `/api/cards`

**Method**: `PATCH`  
**Route**: `/api/cards`

**Body (JSON)**

```json
{
  "id": "65f0b8e4a2c1a0b1b6f1d236",
  "title": "Updated title",
  "description": "Updated description",
  "order": 2,
  "listId": "65f0b7dca2c1a0b1b6f1d235"
}
```

**Body types**

- `id`: string (required)
- Any of: `title` (string), `description` (string), `order` (number), `listId` (string)

**Sample response (200)**

```json
{ "success": true }
```

##### DELETE `/api/cards`

**Method**: `DELETE`  
**Route**: `/api/cards?id=<string>`

**Query params**

- `id` (string, required)

**Sample response (200)**

```json
{ "success": true }
```

### User Flow (Backend)

This is the typical backend call sequence for a Trello-like experience:

1. **App starts**: call `GET /api/test-db` to verify DB connectivity.
2. **User loads dashboard**: call `GET /api/boards?userId=<userId>`.
3. **User creates a board**: call `POST /api/boards` with `{ title, ownerId, members? }`.
4. **User opens a board**: call `GET /api/lists?boardId=<boardId>`.
5. **User creates columns**: call `POST /api/lists` with `{ boardId, title, order }`.
6. **User views a column**: call `GET /api/cards?listId=<listId>`.
7. **User creates a card**: call `POST /api/cards` with `{ listId, title, description?, order }`.
8. **User moves/reorders a card**: call `PATCH /api/cards` with `{ id, listId, order }`.
9. **User deletes a card**: call `DELETE /api/cards?id=<cardId>`.

### Debugging Tips

- **DB connection**: hit `/api/test-db` first.
- **Env vars**: ensure `MONGODB_URI` is set; if you use JWT helpers, set `JWT_SECRET`.
- **Repro quickly** (examples):

```bash
curl -s "http://localhost:3000/api/test-db" | jq
curl -s "http://localhost:3000/api/boards?userId=user_123" | jq

curl -s -X POST "http://localhost:3000/api/boards" \
	-H "Content-Type: application/json" \
	-d '{"title":"My Board","ownerId":"user_123","members":["user_123"]}' | jq

# Auth (JWT endpoints)
curl -s -X POST "http://localhost:3000/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123","name":"Demo"}' | jq

curl -s -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}' | jq

# NextAuth providers (Google appears only if env vars are set)
curl -s "http://localhost:3000/api/auth/providers" | jq
```

### Security Notes

- Never commit secrets (MongoDB URI, JWT secret). Use `.env.local` for local development.
- If a DB URI/password was ever shared publicly, rotate it immediately.
