# Visual Audit - 2026-03-20

## Summary
Audit focused on blank-page behavior across shared frontend routes and global styling.

## Findings

### Fixed
1. `src/app/globals.css:445`
   - `.preview-phone` was included in a shared absolute-position selector
   - Risk: detached preview containers from layout and could visually blank preview pages
   - Fix applied: removed `.preview-phone` from that selector

2. `src/features/projects/components/projects-dashboard-page.tsx:141`
   - `/api/v1/projects` returned `401` for anonymous users and the dashboard did not recover
   - Risk: `/projects` appeared unavailable or blank for first-time users
   - Fix applied: create guest session and retry on `401`

3. `src/features/preview/components/project-preview-page.tsx:108`
   - Preview parsing assumed valid JSON envelopes on every response
   - Risk: non-JSON or malformed responses collapsed the preview route into a failure state
   - Fix applied: tolerant parsing plus envelope validation

4. `src/app/globals.css:1199`
   - `.misc-panel` and `.preview-panel` were mixed into a shared flex row selector, then redefined later as grids
   - Risk: conflicting layout behavior on shared routes
   - Fix applied: removed those panel selectors from the earlier shared flex group

5. `src/app/globals.css:1768`
   - `.editor-layout` locked overflow at the top level
   - Risk: clipped editor content could appear blank on some browser/viewport combinations
   - Fix applied: removed top-level `overflow: hidden`

6. `src/features/projects/components/projects-dashboard-page.tsx:75`
   - Dashboard image resolution assumed `project.scenes` was always an array
   - Risk: one malformed project payload could break the full page
   - Fix applied: normalize `project.scenes` before reading the first item

### Remaining Risks
1. `src/app/globals.css:2`
   `src/app/layout.tsx:12`
   - font vars are referenced but not wired with `next/font`
   - Risk: inconsistent typography, low likelihood of causing blank pages directly

2. `src/app/globals.css:33`
   - `overflow-x: hidden` on `body` can hide off-screen layout bugs
   - Risk: narrow-screen layout problems may look like empty pages

3. `src/features/preview/components/project-preview-page.tsx:199`
   - preview images still depend on public/renderable URLs
   - Risk: scenes can render placeholders if asset URLs are storage keys only

## Validation
- `npm run lint`
- `npm run build`

## Next Checks
1. Hard refresh the browser after restarting `npm run dev`
2. Re-test `/`, `/projects`, and `/projects/[projectId]/preview`
3. If blank pages persist, capture the first browser console error and network failure
