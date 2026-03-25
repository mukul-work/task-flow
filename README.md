# TaskFlow - Trello Clone

A Trello-like task management app built with **React + Vite + Tailwind CSS**.

> Converted from Next.js + TypeScript to React + JavaScript (JSX)

## Tech Stack

- **React 19** (with Vite)
- **JavaScript / JSX** (no TypeScript)
- **Tailwind CSS v3**
- **Radix UI** (Avatar, Slot primitives)
- **Lucide React** (icons)
- **class-variance-authority + clsx + tailwind-merge**

## Project Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.jsx       # Reusable button with variants
│   │   └── avatar.jsx       # Avatar component
│   ├── Navbar.jsx           # Top navigation bar with search
│   ├── Sidebar.jsx          # Collapsible board list sidebar
│   ├── Board.jsx            # Main board with skeleton & empty states
│   ├── ListColumn.jsx       # Individual list column
│   ├── Card.jsx             # Task card with complete/delete
│   ├── AddCardModal.jsx     # Modal to add a new card
│   └── AddListButton.jsx    # Inline form to add a new list
├── lib/
│   ├── mock-data.js         # Sample board/list/card data
│   └── utils.js             # cn() utility (clsx + tailwind-merge)
├── App.jsx                  # Root component (replaces Next.js page + layout)
├── main.jsx                 # React DOM entry point
└── index.css                # Global styles + CSS variables
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production

```bash
npm run build
```

## Key Changes from Next.js + TypeScript

| Before (Next.js + TS) | After (React + JSX) |
|---|---|
| `page.tsx` + `layout.tsx` | `App.jsx` + `main.jsx` |
| `"use client"` directive | Not needed |
| TypeScript interfaces | Removed (plain JS objects) |
| `next/font/google` | System fonts via CSS |
| `@vercel/analytics` | Removed |
| `next.config.ts` | `vite.config.js` |
| `tsconfig.json` | Not needed |
| `npm run dev` (port 3000) | `npm run dev` (port 5173) |

## Features

- ✅ Multiple boards with sidebar navigation
- ✅ Collapsible sidebar
- ✅ Add / delete lists
- ✅ Add / delete cards
- ✅ Mark cards as complete (with strikethrough)
- ✅ Search cards across the board
- ✅ Loading skeleton states
- ✅ Empty states with helpful prompts
- ✅ Keyboard accessible (Escape to close modals)
- ✅ Dark theme with CSS variables
