# Sprint 3 Build Checklist

## Chained Processing
- [ ] Decomposition success chains into motion generation and playback restitch
- [ ] Unrelated scenes are not reprocessed when one scene changes
- [ ] Failed scenes do not block the whole project from progressing

## Motion and Playback
- [ ] Rule-based motion blueprint service is implemented
- [ ] Motion blueprints include camera movement, intensity, per-layer behavior, and transition hints
- [ ] Playback stitching generates versioned timeline JSON
- [ ] Planner reflects current scene order, pacing, overlap, and transitions

## Preview APIs
- [ ] Preview status endpoint returns current project and scene state
- [ ] Playback endpoint returns the latest valid playback plan
- [ ] Reduced-motion preview behavior is supported
- [ ] Fallback behavior works when some scenes fail or remain incomplete

## Reliability and Cost Control
- [ ] Guest quotas and usage limits are enforced
- [ ] TTL cleanup removes expired guest projects and assets safely
- [ ] Claimed projects are excluded from guest cleanup
- [ ] Timeout and stalled-job recovery policies are implemented

## Observability
- [ ] Structured logs include `traceId`, `projectId`, `sceneId`, and `jobId` where relevant
- [ ] Metrics exist for latency, failure rate, retries, and queue depth
- [ ] Provider failures and processing regressions are observable

## Validation and Release
- [ ] Unit tests cover core services, validators, provider mapping, and idempotency logic
- [ ] Integration tests cover guest upload to preview, guest claim, retry flow, and unauthorized access denial
- [ ] Feature flags exist for controlled rollout of processing integrations
- [ ] Rollout path supports canary or limited release validation

## Build Exit Check
- [ ] End-to-end guest upload to preview flow passes
- [ ] Selective regeneration and restitch work correctly
- [ ] Failed scenes can be retried without blocking the whole project
- [ ] Logging, metrics, cleanup, and tests meet MVP release needs
