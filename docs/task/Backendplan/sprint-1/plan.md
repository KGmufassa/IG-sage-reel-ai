# Sprint 1

## Goal
Establish the backend foundation, persistence model, and access control needed to support guest and authenticated project workflows.

## Scope
- Scaffold backend architecture boundaries: presentation, service, repository, infrastructure
- Add typed config and environment validation
- Implement centralized error handling, correlation IDs, and health endpoints
- Configure Prisma and initial migration workflow
- Create core schema for `User`, `GuestSession`, `Project`, `Scene`, `SceneAsset`, `ProcessingJob`, and `PlaybackPlan`
- Add guest expiration and claim metadata
- Implement authenticated session backend
- Implement guest session issuance and scoped access rules
- Create authorization policy layer for preview, save, claim, and export gating

## Tickets
- `BE-001` Backend app structure and architecture boundaries
- `BE-002` Typed configuration and environment validation
- `BE-003` Error handling, request context, and health endpoints
- `BE-004` API conventions and rate limiting
- `BE-005` Prisma setup and initial migration pipeline
- `BE-006` Core domain schema: users, guests, projects, scenes
- `BE-007` Asset, job, and playback persistence schema
- `BE-008` Expiration and claim metadata
- `BE-009` Authenticated session backend
- `BE-010` Guest session issuance and scoping
- `BE-011` Authorization policy layer

## Deliverables
- Backend foundation is running with typed config and API conventions
- Database schema and migrations are in place
- Guest and authenticated ownership models work end to end
- Access control rules are enforceable in services and routes

## Exit Criteria
- Requests have structured logging and error responses
- Guest projects can be created safely
- Authenticated ownership checks are enforced
- Core schema is migration-backed and ready for feature work
