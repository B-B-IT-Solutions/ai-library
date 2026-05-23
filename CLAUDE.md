# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev           # Next.js dev server on localhost:3000
npm run build         # Production build
npm run lint          # ESLint validation
npm run lint:fix      # Auto-fix linting issues in ./src

# Testing
npm run test                                          # Run all tests (TZ=CET)
npm run test -- src/path/to/file.test.ts             # Run a single test file
npm run test -- --testNamePattern="pattern"          # Run tests matching a name
npm run test:watch                                    # Watch mode
npm run test:lcov                                     # With LCOV coverage report

# Database
npm run db:start      # Start Prisma dev environment
npm run db:generate   # Generate Prisma client after schema changes
npm run db:migrate    # Run migrations (dev mode)
npm run db:push       # Push schema changes without migrations
npm run db:reset      # Reset database
npm run db:datainit   # Seed initial data
npm run db:studio     # Open Prisma Studio GUI
```

**Coverage thresholds (enforced in CI):** 99% lines/statements, 98.2% branches, 98.9% functions.

## Architecture

### Data Flow

```
Pages (Server Components) → Server Actions → Services → Repositories → Prisma → PostgreSQL
```

Client-side data fetching uses **TanStack React Query v5**. Runtime validation uses **Zod**.

### Factory Pattern (Data Access Layer)

Access to the database always goes through a factory chain:

- `RepositoryFactory` — instantiates Prisma-backed repositories
- `ServiceFactory` — instantiates services, each receiving a repository
- Services contain business logic; repositories handle raw DB queries

### Major Subsystems

**Authentication** — NextAuth v5 with credentials provider + Prisma adapter. JWT sessions (30-day max). Session cart migration runs on sign-in (unauthenticated cart merges into user cart).

**Prompts & Templates** — Core content objects. Prompts support versioning, categories, and follow-up prompts. Templates have typed form fields — both global reusable fields (shared across templates) and template-specific fields.

**Collections** — User-organized groups of templates, with public/private sharing via tokens.

**E-Commerce** — Products (bundles or individual templates), session-based and user-based carts, Stripe checkout sessions, orders. Cart-to-order conversion happens server-side.

**Subscriptions** — Hybrid model with one-time purchases and recurring plans. Tiers: FREE / BASIC (CHF 9.90/mo, 99/yr) / PRO (CHF 19.90/mo, 199/yr). Stripe webhooks drive subscription lifecycle (checkout, renewal, cancellation). Full status set: ACTIVE, CANCELED, INCOMPLETE, PAST_DUE, UNPAID, TRIALING, PAUSED.

**API Routes** — Live under `src/app/api/`. Stripe webhook endpoint is at `src/app/api/stripe/webhook/`.

### Directory Conventions

- `src/app/` — Next.js App Router pages and layouts; protected routes include `/prompts`, `/marketplace`, `/products`, `/checkout`, `/orders`, `/profile`, `/settings`, `/admin`
- `src/actions/` — Next.js Server Actions (called from Server and Client components)
- `src/services/` — Business logic layer
- `src/repositories/` — Database access via Prisma
- `src/components/` — React components (shadcn/ui + Radix UI primitives)
- `src/lib/` — Shared utilities, Stripe client, auth config, Prisma client
- `prisma/` — Schema, migrations, seed scripts

### Key Libraries

| Concern       | Library                                |
| ------------- | -------------------------------------- |
| UI primitives | Radix UI + shadcn/ui                   |
| Styling       | Tailwind CSS v4 + tailwind-merge + CVA |
| Forms         | React Hook Form + Zod                  |
| Rich text     | Tiptap                                 |
| URL state     | nuqs                                   |
| Toasts        | sonner                                 |
| Date utils    | date-fns v4                            |
| Payment       | Stripe SDK v20                         |
| Legal/consent | Iubenda                                |
| HTTP client   | axios + axios-retry                    |

### Testing Setup

Jest 30 + React Testing Library. Test environment: jsdom. Key mocks are pre-configured in `jest.config.ts` for: next-auth, next/headers, next/cache, Prisma client, Radix UI components, and Tiptap. The test timezone is forced to `CET` via `cross-env`.

## UI Component Guidelines

See **[UI-DESIGN-GUIDELINES.md](./UI-DESIGN-GUIDELINES.md)** for mandatory standards when implementing UI components. Key rules:

- All visible UI text must be **German (de-DE)** — English strings in the UI are a bug
- **Colors: semantic tokens first** — use `text-foreground`, `text-muted-foreground`, `bg-card`, `bg-muted`, `border-border` instead of hardcoded `slate-*` classes
- Forms: always use widget components from `src/components/shared/widgets/`, never raw `FormField`
- Loading states: use skeleton components from `src/components/shared/skeletons.tsx`
- Destructive actions: always use `DeleteDropdownMenuItem` with an `AlertDialog` confirmation
- Icon-only buttons: always add `aria-label` + `<Tooltip>`
- Submit buttons: always show a loading spinner while pending

## Testing

### Unit Tests

- Whenever you add any changes add unit tests and run and make sure that the tets pass.
