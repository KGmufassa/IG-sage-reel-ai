# Sprint 3

## Goal
Complete motion planning, stitched preview support, reliability controls, and release hardening for MVP backend readiness.

## Scope
- Implement chained processing from decomposition to motion to playback restitch
- Build deterministic rule-based motion blueprint service
- Build playback stitching service with versioned timeline JSON
- Expose preview status and playback APIs
- Add reduced-motion and fallback preview behavior
- Add guest quotas, TTL cleanup, and timeout recovery policies
- Add structured processing logs and operational metrics
- Add service and integration tests for critical flows
- Add feature flags and rollout controls for production readiness

## Tickets
- `BE-025` Chained processing orchestration
- `BE-028` Rule-based motion blueprint service
- `BE-029` Playback stitching service
- `BE-030` Preview status and playback APIs
- `BE-031` Reduced-motion and fallback payload behavior
- `BE-032` Guest quotas and usage limits
- `BE-033` TTL cleanup for guest projects and assets
- `BE-034` Timeout and recovery policy
- `BE-035` Structured logging and traceability
- `BE-036` Metrics and alert-ready instrumentation
- `BE-037` Service-layer unit tests
- `BE-038` Integration tests for critical flows
- `BE-039` Feature flags and controlled rollout

## Deliverables
- Ready scenes produce motion blueprints and stitched playback plans
- Preview APIs serve the latest valid playback state
- Guest cleanup and cost controls protect MVP operations
- Observability and tests support release confidence

## Exit Criteria
- End-to-end guest upload to preview flow passes
- Selective regeneration and restitch work correctly
- Failed scenes can be retried without blocking the whole project
- Logging, metrics, cleanup, and tests meet MVP release needs
