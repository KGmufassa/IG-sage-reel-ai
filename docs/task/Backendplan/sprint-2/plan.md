# Sprint 2

## Goal
Enable project creation, uploads, guest-project claiming, scene management, and Qwen-backed decomposition orchestration.

## Scope
- Build guest project claim flow with same-session and expiration validation
- Implement upload validation and secure storage initiation/finalization flow
- Create ordered scenes and thumbnail generation after upload
- Build project CRUD and scene update APIs
- Support reorder, delete, retry, and regenerate operations
- Define decomposition DTOs and provider contracts
- Implement Qwen HTTP client setup with auth, timeout, retry, and tracing
- Implement Qwen adapter normalization layer
- Configure Trigger.dev jobs for decomposition flow
- Persist deterministic asset paths and ordered layer manifests

## Tickets
- `BE-012` Claim guest project service
- `BE-013` Claim endpoint and failure cases
- `BE-014` Upload contract and validation
- `BE-015` Secure storage upload flow
- `BE-016` Scene creation and thumbnail generation
- `BE-017` Project CRUD and metadata update endpoints
- `BE-018` Scene update endpoints
- `BE-019` Regeneration and retry endpoints
- `BE-020` Internal DTOs and provider contracts
- `BE-021` Qwen HTTP client infrastructure
- `BE-022` Qwen adapter normalization layer
- `BE-023` Trigger.dev job setup and execution model
- `BE-024` Scene decomposition job flow
- `BE-026` Deterministic asset pathing and manifest design
- `BE-027` Scene asset persistence service

## Deliverables
- Users can upload images and create ordered scenes
- Guest projects can be claimed by eligible authenticated users
- Qwen integration is set up behind an internal adapter
- Decomposition jobs persist outputs into stable asset manifests

## Exit Criteria
- Upload to scene creation works reliably
- Claim flow succeeds without unnecessary reprocessing
- Scene decomposition runs asynchronously with retries
- Layer outputs and manifests are stored predictably
