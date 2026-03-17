# Backend Plan

## Overview
This folder contains the backend implementation sprint plan for Parallax Story Composer.

## Sprint Sequence
- [Sprint 1 Plan](./sprint-1/plan.md) - foundation, schema, auth, and guest access
- [Sprint 1 Build Checklist](./sprint-1/check-build-list.md)
- [Sprint 2 Plan](./sprint-2/plan.md) - uploads, claim flow, scene APIs, and Qwen decomposition setup
- [Sprint 2 Build Checklist](./sprint-2/check-build-list.md)
- [Sprint 3 Plan](./sprint-3/plan.md) - motion, playback planning, preview APIs, reliability, and release hardening
- [Sprint 3 Build Checklist](./sprint-3/check-build-list.md)

## Dependency Flow
- Sprint 1 establishes architecture, persistence, and access control required by all later work.
- Sprint 2 depends on Sprint 1 for database models, auth rules, guest sessions, and API conventions.
- Sprint 3 depends on Sprint 2 for scene assets, decomposition outputs, and processing orchestration.

## Critical Path
1. Foundation and schema
2. Authenticated and guest ownership
3. Upload and scene creation
4. Qwen decomposition integration
5. Asset persistence and manifests
6. Motion blueprint generation
7. Playback plan stitching
8. Preview APIs and operational hardening

## Primary Files
- `docs/task/Backendplan/sprint-1/plan.md`
- `docs/task/Backendplan/sprint-1/check-build-list.md`
- `docs/task/Backendplan/sprint-2/plan.md`
- `docs/task/Backendplan/sprint-2/check-build-list.md`
- `docs/task/Backendplan/sprint-3/plan.md`
- `docs/task/Backendplan/sprint-3/check-build-list.md`
