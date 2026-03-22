# System MVP Task List

## Purpose

This task list captures everything needed to move the current codebase from partial implementation to a working MVP.

## P0 Core MVP Blockers

- Build real upload storage behind `src/app/api/v1/uploads/[uploadToken]/route.ts` so uploaded file bytes are persisted instead of only token-verified
- Add a real asset-serving strategy for paths produced by `src/modules/assets/pathing.ts` so scene originals, thumbnails, layers, and composites can be rendered in the app
- Wire `src/features/projects/components/project-editor-page.tsx` to live project and scene APIs instead of `src/features/projects/mock-projects.ts`
- Implement editor save/update behavior against `PATCH /api/v1/projects/[projectId]` and `PATCH /api/v1/scenes/[sceneId]`
- Implement scene reorder UI in the editor using `POST /api/v1/projects/[projectId]/scenes/reorder`
- Implement scene retry, regenerate, and delete actions in the editor using the existing scene APIs
- Implement generate and reprocess flow in the editor so users can actually trigger processing from the UI
- Replace stacked preview demo UI in `src/features/preview/components/project-preview-page.tsx` with a true stitched mobile preview that consumes playback timeline data
- Ensure preview can render partially ready projects using fallback behavior without breaking the experience
- Remove or disable mock fallback data in `src/features/projects/components/projects-dashboard-page.tsx` for core app flows

## P0 Auth And Access

- Wire credentials sign-up form in `src/features/auth/components/auth-page.tsx` to `POST /api/v1/auth/register`
- Wire credentials login form in `src/features/auth/components/auth-page.tsx` to NextAuth credentials sign-in
- Add post-auth redirect flow so authenticated users land in a usable area after login and signup
- Implement guest-to-authenticated claim UX using `POST /api/v1/projects/[projectId]/claim`
- Enforce and surface save and export gating cleanly for guests in the editor and preview flows
- Decide whether Google auth is optional for MVP or required; if optional, keep credentials flow as the main path

## P0 Runtime And Local Launch

- Stand up PostgreSQL and validate `DATABASE_URL` flow used by Prisma in `prisma/schema.prisma`
- Add an actual setup document for local MVP bootstrapping using `.env.example`, Prisma, and `npm` scripts
- Document minimum required env values from `src/config/env.ts`
- Add a bootstrapping step for Prisma migration or deploy and Prisma client generation
- Verify health endpoints reflect real readiness expectations, especially DB availability

## P1 Product Flow Completion

- Fetch live project data in the editor on load instead of using fallback scene data
- Surface scene statuses (`uploaded`, `queued`, `processing`, `ready`, `failed`) throughout dashboard, editor, and preview
- Add per-scene context editing and motion controls with persistence
- Add project-level context and style editing with persistence
- Make `Create New Project` actions in dashboard functional instead of disabled
- Make dashboard search, filter, and sort either functional or remove them from MVP
- Show empty states based on real data, not mock libraries
- Make preview route resilient when assets are still processing or unavailable
- Show actionable failure states for scene processing errors with retry entry points

## P1 Media Pipeline Hardening

- Define where uploaded originals and generated assets live for local development and MVP deployment
- Persist decomposition outputs as accessible files or objects instead of metadata-only path records
- Generate or proxy thumbnails so dashboard and editor cards can display real images
- Ensure playback plans reference renderable asset URLs
- Validate the mocked Qwen path produces a believable full end-to-end local preview
- Decide whether real Qwen provider integration is in MVP or whether mock mode is the default MVP launch mode

## P1 Security And Operational Safety

- Protect internal maintenance endpoints in `src/app/api/v1/internal/maintenance/**/route.ts`
- Review whether in-memory rate limiting is acceptable for MVP deployment or only local development
- Validate guest session cookie lifecycle and expiration behavior from `src/modules/guest-sessions/service.ts`
- Confirm project authorization behavior across guest and authenticated states in real UI flows
- Ensure secrets and auth config are clearly documented and not silently defaulted in production

## P1 UX Cleanup For Honest MVP Scope

- Remove or relabel disabled near-feature controls in `src/features/projects/components/project-editor-page.tsx`
- Remove or relabel static settings actions in `src/features/settings/components/settings-page.tsx` if settings are not part of MVP
- Remove or relabel footer and product links in `src/features/marketing/components/landing-page.tsx` that point to nonexistent routes or features
- Decide whether `/settings` stays in MVP; if not, hide it from `src/features/shared/components/app-header.tsx`
- Replace export messaging with a clear authenticated-only coming-soon gate
- Make auth pages reflect actual available auth methods instead of mixed aspirational copy

## P1 Missing Routes And Navigation

- Add `/dashboard` or stop referencing it as a distinct destination if `/projects` is the real dashboard
- Add `/forgot-password` only if password reset is included in MVP; otherwise remove the trigger
- Audit all nav and CTA links against real app routes from `src/app/**/page.tsx`
- Add placeholder legal, support, and docs routes only if they are required for launch credibility

## P2 Data Lifecycle And Maintenance

- Verify guest project cleanup behavior from `src/modules/maintenance/service.ts`
- Verify processing timeout recovery behavior from `src/modules/maintenance/service.ts`
- Decide whether maintenance endpoints are manually triggered for MVP or run on a schedule
- Define guest asset expiration behavior consistently across originals, generated assets, and playback plans

## P2 Testing And Validation

- Add unit tests for project service and repository behavior
- Add unit tests for scene service and repository behavior
- Add tests for auth registration and login flows
- Add tests for guest session and project claim flows
- Add tests for playback generation with partial-ready and failed scenes
- Add tests for upload init, finalize, and storage flow
- Add integration coverage for the happy path: guest create -> upload -> finalize -> process -> preview
- Run `npm run lint`, targeted tests, and `npm run build` as final readiness gates once implementation starts

## P2 Product Decisions To Make

- Decide whether MVP preview must include a true pinned scroll engine or whether a simpler stitched vertical player is acceptable
- Decide whether settings is in scope or should be deferred entirely
- Decide whether Google auth is required for launch
- Decide whether export stays fully hidden or visible as gated or coming soon
- Decide whether dashboard mock fallbacks should be removed entirely or replaced with explicit demo mode

## Suggested Execution Sequence

1. Storage and public asset delivery
2. Live editor wiring
3. Live preview rendering from playback plan
4. Credentials auth and guest claim flow
5. Dashboard cleanup and real project loading
6. Route and navigation cleanup
7. Security hardening
8. Test and build validation
