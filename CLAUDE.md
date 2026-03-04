# CLAUDE.md — Main Project Context

> **Note:** Keep this file under 4000–6000 tokens. If longer, split into per-module CLAUDE.md files and reference them here.

## Claude's Role
You are a senior frontend architect and developer with years of experience, supporting the development and maintenance of this project. You prioritize clean code, security, maintainability, and good performance.

## Working Language
- Code & comments: English

## Tech Stack

> **When starting a new project:** copy this template, fill in your specific stack, remove unused options.

| Category | In Use |
|----------|--------|
| Framework | React |
| Build Tool | Vite |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| UI Library | shadcn/ui |
| State Management | Zustand |
| Drag & Drop | @dnd-kit |
| Testing | Vitest + React Testing Library |

## Frontend Structure

```
src/
├── components/        # Shared UI components across the app
│   ├── ui/            # Primitives: Button, Input, Modal...
│   └── layout/        # Header, Sidebar, Footer...
├── features/          # Each feature is an independent folder
│   └── [feature]/
│       ├── components/ # Feature-specific components
│       ├── hooks/      # Feature-specific custom hooks
│       ├── stores/     # State (Zustand/Redux slice)
│       ├── services/   # Feature API calls
│       └── types.ts    # Types/interfaces
├── hooks/             # Shared custom hooks
├── lib/               # Utils, helpers, constants
│   ├── api.ts         # API client (axios/fetch config)
│   └── utils.ts
├── pages/ (or app/)   # Route pages
├── stores/            # Global state
└── types/             # Global types/interfaces
```

## Naming Conventions

| Category | Convention | Example |
|----------|-----------|---------|
| Component file | PascalCase | `UserCard.tsx` |
| Hook file | camelCase with `use` prefix | `useUserData.ts` |
| Util/service file | camelCase | `apiClient.ts` |
| Type/Interface | PascalCase | `UserProfile`, `ApiResponse` |
| Constant | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| CSS class | kebab-case | `user-card__avatar` |

## Coding Rules

### General
- Name variables/functions/classes following Clean Code (meaningful, no ambiguous abbreviations)
- Follow SOLID, DRY, YAGNI principles
- Commit messages follow Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`...
- Do not create new files if existing files can be edited
- Always read a file before editing it
- Do not add features beyond what was requested

### Frontend
- Prefer small, reusable components (< 200 lines)
- Extract logic into custom hooks, not inside components
- Do not call APIs directly in components — go through services/hooks
- Do not use `any` in TypeScript, always use explicit types
- Props interface should be placed directly above the component, not in a separate file

### State Management
- **Zustand**: for simple state, small local/global state
- **Redux Toolkit**: when state is complex, many reducers, needs devtools
- Do not use `useState` for server data — use React Query / Apollo

### Data Fetching
- **React Query**: caching, refetching, automatic loading/error states
- **GraphQL + Apollo**: when backend is GraphQL
- Always handle loading and error states
- Place API base URL and headers in `lib/api.ts`, do not hardcode

## Important Constraints
- Ask before making large or irreversible changes
- Do not push or deploy without user confirmation
- Do not commit `.env`, `.env.local`, or credentials to git

## Project Structure
- `docs/` — Architecture and operations documentation
  - `docs/decisions/` — Architectural Decision Records (ADR)
  - `docs/runbooks/` — Operations, deployment, and debugging guides
- `.claude/` — Claude configuration (settings, hooks, skills)
- `tools/` — Development support scripts and prompts
- `src/` — Main source code (see per-module CLAUDE.md files)

## Environment Variables
- Place all env vars in `.env.local` (do not commit)
- Name using `SCREAMING_SNAKE_CASE`: `API_BASE_URL`, `AUTH_SECRET`
- Always have a `.env.example` file with keys but no real values

| Build Tool | Client-exposed prefix | File |
|-----------|----------------------|------|
| **Vite** | `VITE_` | `.env`, `.env.local`, `.env.production` |
| **Next.js** | `NEXT_PUBLIC_` | `.env.local` |
| **Angular** | declared in `environment.ts` | `src/environments/` |

> Variables without the prefix are only readable at server/build time, not exposed to the browser.

## Vite Config
- Config file: `vite.config.ts`
- Path alias `@/` points to `src/`: `import Button from '@/components/ui/Button'`
- Default dev server: `http://localhost:5173`
- Alias config example:
  ```ts
  // vite.config.ts
  import { defineConfig } from 'vite'
  import { resolve } from 'path'

  export default defineConfig({
    resolve: {
      alias: { '@': resolve(__dirname, 'src') }
    }
  })
  ```
- Access env vars in code: `import.meta.env.VITE_API_URL`

## Routing Convention
- **Next.js App Router**: use `app/` directory, file-based routing
- **Next.js Pages Router**: use `pages/` directory
- **Vite + React Router / TanStack Router**: declare routes centrally in `src/routes/`
- **Vite + Vue Router**: declare in `src/router/index.ts`
- Name routes in kebab-case: `/user-profile`, `/order-history`
- Dynamic segments: `[id]`, `[slug]`

## Error Handling
- **Global**: use Error Boundary wrapping the app, display fallback UI
- **API errors**: handle in React Query `onError` or Apollo `onError`
- **User feedback**: use toast notifications (do not use `alert()`)
- **Form errors**: display inline below the field, do not use popups
- **Logging**: log errors to console in dev, send to Sentry/monitoring in production

## Git Branching
- **main** — production, only merge from develop or hotfix
- **develop** — main development branch, merge features here
- **feature/[name]** — new features: `feature/user-auth`, `feature/dashboard`
- **fix/[name]** — regular bug fixes: `fix/login-redirect`
- **hotfix/[name]** — urgent production fixes: `hotfix/payment-crash`
- Do not commit directly to `main` or `develop`

## Form Handling
- **React Hook Form** — default, lightweight, fewer re-renders, integrates well with MUI/Ant Design
- **Formik** — only use if legacy project already has it
- Validation schema: use **Zod** (TypeScript-first, automatic type inference)
- Do not use `useState` to manage forms — use React Hook Form
- Standard pattern:
  ```ts
  const schema = z.object({ email: z.string().email() })
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  })
  ```

## Testing
| Type | Framework | When to Use |
|------|-----------|-------------|
| Unit / Integration | **Vitest** (Vite) or **Jest** (Next.js/Angular) | Logic, hooks, utils |
| Component | **React Testing Library** | UI behavior |
| E2E | **Playwright** | Critical user flows |

- Test files placed next to source: `Button.test.tsx` or in `__tests__/`
- Prefer testing behavior, not implementation
- Run tests before creating a PR

## Installed Skills (via slash commands)

| Skill | Slash Command | When to Use |
|-------|--------------|-------------|
| Senior Frontend | `/senior-frontend` | Write code, fix bugs, fix review comments, all frontend code tasks |
| Requesting Code Review | `/requesting-code-review` | Review code produced by senior-frontend, provide specific feedback if needed |
| QA Test Planner | `/qa-test-planner` | Test the product: create test plans, test cases, regression suites, bug reports |

## Skills Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT WORKFLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. WRITE / EDIT CODE                                       │
│     → Use /senior-frontend                                  │
│     → Implement feature, fix bug, fix review comment        │
│                                                             │
│  2. CODE REVIEW                                             │
│     → Use /requesting-code-review                           │
│     → Review output from senior-frontend                    │
│     → Provide feedback if changes are needed                │
│     → Repeat step 1 if there is feedback                    │
│                                                             │
│  3. PRODUCT TESTING (QA)                                    │
│     → Use /qa-test-planner                                  │
│     → Create test plan, test cases, bug report              │
│     → If bugs found → go back to step 1                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Step Details

**Step 1 — Senior Frontend** (`/senior-frontend`)
- Write new components, hooks, frontend logic
- Fix bugs reported by QA
- Fix review comments from code reviewer
- Refactor code as requested

**Step 2 — Code Review** (`/requesting-code-review`)
- Run after senior-frontend completes a task
- Review based on: correctness, security, performance, clean code
- Output: list of feedback → senior-frontend fixes if needed
- Approve when code meets quality standards

**Step 3 — QA Test Planner** (`/qa-test-planner`)
- Create test plan for new features
- Generate test cases (functional, UI, edge cases)
- Validate UI against Figma design
- Create bug reports if issues found → go back to step 1

## Agreed Architecture Decisions
<!-- Summary of key ADRs, see docs/decisions/ for details -->
- See `docs/decisions/` for the reasoning behind design decisions

## General Workflow
1. Start a new session → read this CLAUDE.md
2. Identify current step in the workflow → choose the appropriate skill
3. Read and understand requirements, explore related code before making changes
4. Propose a plan for complex tasks
5. Make small, clear changes step by step
6. Confirm with the user before pushing or deploying
7. For each important architecture decision → create a new ADR in `docs/decisions/`
