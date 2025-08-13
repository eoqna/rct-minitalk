# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Minitalk is a simple real-time chat application for couples built with React + TypeScript + Vite. It uses Supabase for backend services and real-time functionality with PIN-based authentication.

## Common Development Commands

```bash
# Start development server (runs on host 0.0.0.0:3000)
npm start
# or 
yarn start

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture Overview

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **State Management**: Zustand
- **Styling**: Styled Components + TailwindCSS
- **Backend/Database**: Supabase (PostgreSQL + real-time subscriptions)
- **Routing**: React Router DOM
- **Date Handling**: dayjs

### Database Schema (Supabase)
- `tb_user`: Stores user information with PIN authentication
- `tb_message`: Stores chat messages with real-time sync

### Key Components Structure

```
src/
├── pages/
│   ├── Login.tsx        # PIN-based login page
│   └── Chat.tsx         # Main chat interface with real-time messaging
├── components/
│   └── ChatMessage.tsx  # Individual message component
├── store/
│   └── useAppStore.ts   # Zustand global state (user management)
├── util/
│   ├── supabase.ts      # Supabase client configuration
│   ├── config.ts        # Environment configuration
│   └── style.ts         # Shared styled components
└── types/
    └── index.d.ts       # TypeScript type definitions
```

### State Management
- Uses Zustand for simple global state management
- Main store (`useAppStore`) manages user authentication state
- User persists through navigation after PIN login

### Real-time Features
- Supabase real-time subscriptions for instant message delivery
- Automatic message queue with debouncing (200ms) to prevent spam
- Auto-scroll to bottom on new messages
- Optimistic UI updates

### Styling Approach
- Mobile-first design (max-width: 360px container)
- Styled Components for component-level styling
- CSS-in-JS with props-based conditional styling
- Custom scrollbar styling for message container

### Authentication Flow
1. User enters PIN on login page
2. PIN validated against `tb_user` table in Supabase
3. User data stored in Zustand store
4. Navigation to chat page with authentication guard

### Message Flow
1. User types message and submits
2. Message added to internal queue with timestamp
3. Queue processor sends to Supabase with debouncing
4. Supabase real-time subscription broadcasts to all clients
5. UI updates automatically via subscription

## Development Notes

- The app uses lazy loading for route components
- Supabase credentials are stored in `src/util/config.ts`
- Message queue system prevents rapid-fire submissions
- Real-time subscriptions are properly cleaned up on component unmount
- Authentication state is checked on chat page load