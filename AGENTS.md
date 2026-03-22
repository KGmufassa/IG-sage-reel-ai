# AGENTS.md
Repository-specific guidance for coding agents working in this project.

## Project Snapshot
- App: `parallax-story-composer`
- Stack: Next.js 15 App Router, React 19, TypeScript, Prisma, PostgreSQL, NextAuth, Zod, Pino, Vitest
- Package manager: `npm`
- TS config: strict mode, no emit, bundler module resolution, `@/* -> src/*`
- API style: versioned routes under `src/app/api/v1/**`
- Architecture style: layered, feature-based modules

## Rule Files
- Primary architecture rules: `docs/rules/architecture-rules.md`
- `.cursorrules`: not present
- `.cursor/rules/`: not present
- `.github/copilot-instructions.md`: not present

## Setup Notes
- Use `.env.example` as the source of expected environment variables
- Core runtime values include `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and `INTERNAL_UPLOAD_TOKEN_SECRET`
- Upload and pipeline features also depend on Qwen-related env vars
- Local work can use `QWEN_MOCK_MODE=true`


## Canonical Commands
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Create production build: `npm run build`
- Start production server: `npm run start`
- Lint entire repo: `npm run lint`
- Run all tests once: `npm test`
- Run tests in watch mode: `npm run test:watch`

## Narrow Validation Commands
- Run one test file: `npm test -- tests/unit/modules/uploads/service.test.ts`
- Alternate one test file: `npx vitest run tests/unit/modules/uploads/service.test.ts`
- Run one named test: `npx vitest run tests/unit/modules/uploads/service.test.ts -t "creates and verifies upload contracts"`
- Lint one file: `npx eslint src/modules/projects/service.ts`
- Prefer the narrowest relevant validation first, then broaden only if needed

## Build Expectations
- If you change service, controller, validator, or route behavior, run the closest relevant unit test file and `npm run lint`
- If you change routing, shared types, env/config wiring, or Next.js integration boundaries, run `npm run build` when practical
- If you change Prisma schema or repository persistence behavior, add a migration and validate affected tests

## Repository Layout
- `src/app/`: Next.js pages and API route entrypoints
- `src/interfaces/http/`: controllers plus HTTP support helpers
- `src/modules/<feature>/`: feature slices with service/repository/validator/types/index files
- `src/core/`: shared error, HTTP, logging, request, and observability code
- `src/infrastructure/`: Prisma client, auth/providers, jobs, and rate limiting
- `src/config/`: env parsing and shared constants
- `prisma/`: schema and migrations
- `tests/unit/`: unit tests grouped by module/feature

## Architecture Rules
- Follow strict layering: presentation -> service -> repository -> infrastructure
- Do not place business logic in route handlers or controllers
- Services may call repositories; repositories must not call services
- Infrastructure must not contain domain business logic
- Avoid circular dependencies across features and shared modules
- Keep features independently testable
- Put reusable cross-feature logic in `src/core/` or `src/config/`
- Keep APIs versioned under `/api/v1`
- Apply rate limiting in routes where the existing route pattern already does so

## Route And Controller Patterns
- Prefer `defineRoute(...)` for API handlers
- Keep route files thin: rate limiting, request identification, controller delegation
- Preserve `x-correlation-id` behavior from shared route infrastructure
- Build responses with shared helpers such as `ok(...)` and `created(...)`, and parse bodies with helpers like `parseJsonBody`
- Keep access checks in the existing HTTP/controller support layer

## Feature Organization
- Keep feature code together under `src/modules/<feature>/`
- Typical files are `service.ts`, `repository.ts`, `validator.ts`, `types.ts`, and `index.ts`
- Use feature `index.ts` re-exports where the repo already follows that pattern
- Avoid unnecessary cross-feature imports and coupling

## Imports
- Prefer absolute `@/` imports over long relative paths
- Keep external/framework imports before internal imports
- Use `import type` for type-only imports where appropriate
- Avoid churn-only import reordering when it does not help the change

## Formatting
- Use 2-space indentation
- Use double quotes
- Do not use semicolons
- Match the repo's compact object and function formatting
- Add comments only when a block is genuinely non-obvious

## TypeScript And Types
- Preserve strict typing; avoid `any` unless there is no reasonable alternative
- Prefer feature-local types and Zod-inferred types when they align with runtime validation
- Use narrow unions and literals for stateful behavior
- Respect `typedRoutes: true` in `next.config.ts`
- Do not read env vars directly outside `src/config/env.ts`, except for the existing auth helper pattern already present there

## Naming Conventions
- Use `camelCase` for variables, functions, and object properties
- Use `PascalCase` for classes and exported types
- Use `UPPER_SNAKE_CASE` for constants and environment keys
- Use kebab-case for filenames and route segment names
- Singleton exports follow existing patterns such as `projectService`, `projectRepository`, and `projectController`
- Name Zod schemas descriptively, for example `createProjectInputSchema`

## Validation Rules
- Validate request payloads with Zod in feature-local `validator.ts` files
- Use trimming, length limits, enums, UUID validation, and coercion where appropriate
- Let centralized error handling produce client-facing validation responses
- Do not bypass validation in controllers or services for request input

## Error Handling
- Use `AppError` for expected application and domain failures
- Include a stable machine-readable `code`
- Set an appropriate HTTP `statusCode`
- Add structured `details` when extra context is useful
- Do not expose raw stack traces to clients
- Let shared error response helpers convert thrown errors into HTTP responses
- Never silently swallow errors

## Logging And Observability
- Use the shared Pino logger from `src/core/logging/logger.ts`
- Keep logs structured and machine-readable
- Preserve request correlation IDs in HTTP flows
- Health endpoints already exist under `/api/v1/health/live` and `/api/v1/health/ready`

## Database And Prisma Guidance
- Prisma targets PostgreSQL
- Use UUID primary keys and preserve snake_case database column mappings
- Keep `created_at` and `updated_at` conventions intact
- Add migrations for schema changes
- Keep foreign keys and common lookup paths indexed
- Keep DB access in repositories or infrastructure, never in route handlers or controllers

## Authentication And Session Notes
- NextAuth is in use; preserve existing session and actor resolution patterns
- Guest-session flows are first-class and enforced in several modules
- Do not weaken access checks when editing project, scene, upload, or preview flows

## Testing Guidance
- Existing automated tests live under `tests/unit/`
- Current tests focus heavily on service and validator behavior; follow that style first
- Use Vitest primitives such as `describe`, `it`, `beforeEach`, and `expect`
- Reset env cache when tests mutate `process.env`
- Add or update the closest relevant unit test whenever behavior changes

## Agent Do
- Make the smallest coherent change in the correct layer
- Preserve existing response shapes, error codes, and naming style
- Read the surrounding module before introducing a new pattern
- Report the files changed and commands run

## Agent Do Not
- Do not invent a new validation, logging, or error-handling framework
- Do not move business logic into controllers or route handlers
- Do not scatter direct `process.env` reads across the codebase
- Do not replace an established module pattern unless the repo already supports the new one

## Good Default Workflow
- Read the target route, controller, service, validator, repository, and types files first
- Make the smallest architecture-aligned change
- Run the most specific test command that covers the change
- Run `npm run lint` after material code changes
- Run `npm run build` for route, config, or typing-boundary changes when practical
- If a broader validation step is skipped, say so explicitly in your handoff
