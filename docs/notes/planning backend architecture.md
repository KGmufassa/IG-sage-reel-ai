# Outlining comprehensive plan structure

## Context Window Summary

This planning thread focused on backend architecture for Parallax Story Composer based on the draft PRD at `docs/reference/prd-draft.md`.

Key outcomes discussed:

- The backend must support:
  - Async processing pipeline (decomposition -> motion -> stitching)
  - Guest preview + authenticated save/export gating
  - Organized scene + asset persistence
  - Scene-level retry/regeneration
- Recommended MVP backend direction:
  - Next.js API/backend runtime + PostgreSQL + Prisma
  - Job orchestration (Inngest/Trigger.dev)
  - S3-compatible storage for uploads/generated assets
  - Qwen decomposition integration via a dedicated wrapper
- Confirmed decision:
  - Use direct Node -> Qwen API for MVP (with abstraction so it can later move to Python gateway if needed).

## Qwen API Wrapper Planning Summary

### Why a wrapper is needed

- Isolate provider-specific behavior from business logic.
- Normalize Qwen outputs into app-stable contracts.
- Improve reliability (timeouts, retries, error handling).
- Preserve observability and traceability for failed scenes.

### Core capabilities to implement

- Submit decomposition jobs for scene images.
- Track status (`queued`, `processing`, `ready`, `failed`).
- Retrieve and normalize decomposition results.
- Persist ordered layered assets with metadata.
- Support retries for transient failures.

## Comprehensive Plan Structure

### Phase 0 - Contracts and design lock

Define stable internal interfaces and DTOs first:

- `DecompositionRequest`
- `DecompositionResult`
- `ProviderError` (normalized error taxonomy)
- Idempotency key strategy: `sceneId + sourceHash + modelVersion + targetLayers`

Expected output:
- Provider-agnostic decomposition interface for service layer use.

### Phase 1 - Qwen HTTP client (infrastructure)

Implement provider client with:

- Auth header injection from centralized config
- Timeout control
- Retry policy with exponential backoff + jitter
- Correlation/trace ID propagation
- Input validation (mime, size, layer target bounds)

Expected output:
- Hardened low-level client for calling Qwen endpoints.

### Phase 2 - Decomposition wrapper module

Implement wrapper methods:

- `submitDecomposition()`
- `getDecompositionResult()`
- optional `cancelDecomposition()`

Responsibilities:

- Hide raw Qwen payload quirks
- Map raw provider responses to normalized DTOs
- Map provider errors to internal error codes

Expected output:
- Clean provider adapter usable by processing service.

### Phase 3 - Orchestration integration

Integrate wrapper into async worker/job system:

- One decomposition job per scene
- State transitions persisted in DB
- Per-scene lock to prevent duplicate active jobs
- Retry only transient failures

Expected output:
- Reliable scene processing flow from upload to terminal status.

### Phase 4 - Asset organization and persistence

Store outputs in organized deterministic structure:

- Storage key pattern:
  `projects/{projectId}/scenes/{sceneId}/v{version}/layers/{index}.png`
- Save scene asset manifest with ordered layers and metadata
- Persist composite preview and model/version info

Expected output:
- Layered images returned in a predictable, queryable format.

### Phase 5 - Observability and ops readiness

Add structured logs and metrics:

- Logs: `traceId`, `projectId`, `sceneId`, `jobId`, `providerJobId`
- Metrics: success/failure rates, latency p50/p95/p99, retries, queue depth
- Alerts for fail-rate spikes and latency regressions

Expected output:
- Fast debugging and production monitoring coverage.

### Phase 6 - Testing strategy

Implement tests across layers:

- Unit: mapper/parser/retry/idempotency logic
- Integration: mocked Qwen API happy and failure paths
- Workflow tests: failed scene -> retry -> ready
- Contract tests: stable output schema for downstream services

Expected output:
- Confidence in correctness and failure handling before rollout.

### Phase 7 - Rollout strategy

- Feature flag wrapper integration
- Canary subset of decomposition jobs
- Monitor metrics and error distributions
- Ramp to full traffic after stability window

Expected output:
- Low-risk production adoption.

## Organized Return-State Model for Layered Results

Each scene should store a versioned manifest including:

- Scene and project IDs
- Provider model metadata
- Ordered layer list (`layer_index`, URL/key, dimensions)
- Composite preview URL/key
- Timing and warning metadata
- Terminal processing status

This ensures renderer/planner can consume a clean, stable format.

## Open Execution Notes

This document captures the agreed planning direction and is ready to use as the implementation guide for the Qwen API wrapper build.
