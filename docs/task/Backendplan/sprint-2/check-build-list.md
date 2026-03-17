# Sprint 2 Build Checklist

## Project Claiming
- [ ] Guest project claim service is implemented
- [ ] Claim endpoint validates same-session ownership
- [ ] Claim endpoint blocks expired or already claimed projects
- [ ] Successful claim transfers ownership without unnecessary reprocessing

## Uploads and Scene Creation
- [ ] Upload validation enforces file type, size, and count limits
- [ ] Secure upload flow stores original images without exposing privileged storage credentials
- [ ] Uploaded images create ordered scene records
- [ ] Thumbnail generation and persistence work for uploaded scenes

## Project and Scene APIs
- [ ] Project CRUD endpoints work for supported guest and authenticated use cases
- [ ] Scene update endpoints support context and motion settings
- [ ] Scene reorder and delete endpoints work correctly
- [ ] Retry and regenerate endpoints target only the intended scene

## Qwen Integration
- [ ] Internal decomposition DTOs and provider contracts are defined
- [ ] Qwen client is configured with auth, timeout, retry, and tracing
- [ ] Qwen adapter normalizes success and error responses into internal formats
- [ ] Retryable and terminal provider errors are distinguishable

## Async Processing
- [ ] Trigger.dev jobs are configured for decomposition flow
- [ ] One active decomposition job per scene is enforced
- [ ] Scene statuses move through queued, processing, ready, and failed states correctly
- [ ] Transient failures retry automatically within defined limits

## Asset Persistence
- [ ] Asset paths follow a deterministic versioned structure
- [ ] Ordered layer manifests are persisted
- [ ] Scene asset records store dimensions, metadata, and layer order

## Build Exit Check
- [ ] Upload to scene creation works reliably
- [ ] Claim flow succeeds without unnecessary reprocessing
- [ ] Scene decomposition runs asynchronously with retries
- [ ] Layer outputs and manifests are stored predictably
