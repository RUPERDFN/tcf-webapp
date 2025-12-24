# TheCookFlow - Replit Configuration

## Overview

TheCookFlow is an AI-powered meal planning web application that generates personalized weekly menus and shopping lists. The app features a distinctive "chalkboard" visual aesthetic with chalk-style typography and dark backgrounds. Users complete an 8-step onboarding questionnaire about their dietary preferences, budget, and household size, then receive AI-generated meal plans tailored to their needs.

## Recent Changes (December 2024)
- Converted from mockup to full-stack application with PostgreSQL database
- Implemented JWT authentication with bcrypt password hashing
- Added user profiles with cooking preferences persistence
- Fixed all component imports to use named exports from shadcn/ui
- Fixed CSS @import order for Tailwind v4 compatibility
- Backend routes: /api/auth/register, /api/auth/login, /api/profile, /api/menus, /api/shopping

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Zustand with persistence middleware for global state (auth, onboarding data, dashboard data)
- **Data Fetching**: TanStack React Query for server state management with Axios for HTTP requests
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS v4 with custom chalkboard theme (dark backgrounds, chalk-style fonts)
- **Fonts**: Permanent Marker (chalk headings), Nunito (body text)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints under `/api/` prefix
- **Authentication**: JWT tokens with bcrypt password hashing
- **Build System**: Custom build script using esbuild for server bundling, Vite for client

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` defines all tables (users, profiles, menus, shopping_lists)
- **Migrations**: Managed via `drizzle-kit push` command

### Authentication Flow
1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Server returns JWT token stored in client localStorage via Zustand auth store
3. API client interceptor attaches Bearer token to all authenticated requests
4. Server middleware validates JWT and extracts userId for protected routes

### Application Flow
1. **Landing** (`/`) - Marketing page with CTAs
2. **Auth** (`/login`, `/register`) - JWT-based authentication
3. **Onboarding** (`/onboarding/:step`) - 8-step questionnaire collecting dietary preferences
4. **Loading** (`/loading`) - Menu generation screen calling external Chef API
5. **Dashboard** (`/dashboard`) - Displays weekly menu and shopping list

### Key Design Patterns
- **Monorepo Structure**: `client/`, `server/`, `shared/` directories with shared TypeScript schemas
- **Path Aliases**: `@/` maps to client/src, `@shared/` maps to shared directory
- **Mock API Fallbacks**: Axios interceptors provide mock responses when backend unavailable
- **Component Composition**: Reusable ChalkCard, ChalkButton components for consistent theming

## External Dependencies

### Third-Party Services
- **Chef API**: External AI service at `VITE_CHEF_BASE_URL` for menu generation (defaults to `https://chef.thecookflow.com`)
- **PostgreSQL Database**: Required via `DATABASE_URL` environment variable

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string (required)
- `JWT_SECRET` - Secret key for JWT signing (defaults to dev value)
- `VITE_API_BASE_URL` - Backend API URL (optional, defaults to same origin)
- `VITE_CHEF_BASE_URL` - External Chef AI service URL

### Key NPM Dependencies
- `drizzle-orm` + `drizzle-kit` - Database ORM and migrations
- `express` - Web server framework
- `jsonwebtoken` + `bcryptjs` - Authentication
- `zustand` - State management
- `@tanstack/react-query` - Server state
- `framer-motion` - Animations
- `react-hot-toast` - Toast notifications