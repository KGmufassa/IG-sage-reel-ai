# Sprint 1 Build Checklist

## Foundation
- [ ] Backend app structure exists and follows presentation, service, repository, and infrastructure boundaries
- [ ] Shared `core` modules exist for config, errors, logging, and request context
- [ ] API routes follow `/api/v1` conventions

## Configuration and Runtime
- [ ] Typed configuration is implemented
- [ ] Environment variables are validated on startup
- [ ] No direct environment access exists outside the config layer
- [ ] Liveness and readiness endpoints are available

## Error Handling and Observability
- [ ] Centralized error handling returns a consistent response shape
- [ ] Correlation IDs are attached to requests and logs
- [ ] Structured logging is enabled for API requests and failures

## Database and Schema
- [ ] Prisma is configured and connected to PostgreSQL
- [ ] Initial migrations run successfully
- [ ] Core models exist for `User`, `GuestSession`, `Project`, `Scene`, `SceneAsset`, `ProcessingJob`, and `PlaybackPlan`
- [ ] UUID primary keys and timestamps are present on required models
- [ ] Foreign keys and lookup fields are indexed

## Guest and Auth Access
- [ ] Authenticated session resolution works server-side
- [ ] Guest session issuance works without full signup
- [ ] Guest projects are scoped to a guest session ID
- [ ] Authorization policies enforce preview, save, claim, and export boundaries

## Claim and Expiration Metadata
- [ ] Guest expiration fields exist on temporary projects and assets
- [ ] Claim support fields such as `guest_session_id` and `claimed_at` exist
- [ ] Claimed projects can be distinguished from temporary guest projects

## Build Exit Check
- [ ] Guest projects can be created safely
- [ ] Authenticated ownership checks are enforced
- [ ] Core schema is migration-backed and ready for feature work
