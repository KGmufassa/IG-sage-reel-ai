# Frontend Build Task List

## Objective

Build the first real frontend for Parallax Story Composer with high visual fidelity to the HTML mockups in `design/HTML/`, while wiring only the routes and actions that are already supported by the current backend.

Unsupported triggers must remain visible and preserve the mockup treatment, but behave as disabled or coming soon.

## Confirmed Backend-Supported Integrations

These areas are already backed by current routes, controllers, and module contracts and can be safely integrated into the frontend.

- Session resolution via `src/app/api/v1/auth/session/route.ts`
- Registration via `src/app/api/v1/auth/register/route.ts`
- NextAuth session and provider flows via `src/app/api/auth/[...nextauth]/route.ts` and `src/auth.ts`
- Guest session issuance via `src/app/api/v1/guest-sessions/route.ts`
- Project list, create, get, update, delete, claim, and reorder via `src/app/api/v1/projects/**`
- Scene update, delete, retry, regenerate, and upload finalization via `src/app/api/v1/scenes/**` and `src/app/api/v1/projects/[projectId]/uploads/**`
- Preview status and playback via `src/app/api/v1/projects/[projectId]/preview/**`

## Confirmed Unsupported Or Incomplete Areas

These areas should not be treated as fully functional in the first frontend pass.

- Password reset flow
- Export flow
- Billing, pricing, and upgrade flow
- Notifications system
- Documentation, API reference, community, support, privacy, and terms frontend routes
- Gallery route
- Change password flow
- Sign out of all devices flow
- Persisted user settings API for story pace, transition style, and motion preset
- Editor depth-focus persistence contract
- Real upload byte persistence beyond upload token acceptance

## Build Principles

- Preserve the mockup layouts as closely as possible
- Default to App Router server components
- Add client components only where interactivity is required
- Keep route files thin and move behavior into feature modules
- Mirror backend feature boundaries on the frontend
- Do not invent payload fields that are not present in current validators or backend contracts
- Represent unsupported triggers with disabled or coming-soon behavior while preserving visual placement

## Route Build Scope

### Phase 1 Routes

- `/`
- `/login`
- `/signup`
- `/projects`
- `/projects/new`
- `/projects/[projectId]/editor`
- `/projects/[projectId]/preview`
- `/settings`

### Deferred Routes

- `/forgot-password`
- `/projects/[projectId]/export`
- `/settings/security`
- `/docs`
- `/api-reference`
- `/support`
- `/terms`
- `/privacy`
- `/gallery`
- `/pricing`
- `/community`

## Detailed Task List

### 1. Frontend foundation and structure

- Create `docs/task/Frontendplan/` as the frontend planning home
- Create route entry files under `src/app/` for the approved page set
- Create a frontend feature folder structure aligned to backend domains:
  - `src/features/auth/`
  - `src/features/projects/`
  - `src/features/scenes/`
  - `src/features/uploads/`
  - `src/features/preview/`
  - `src/features/settings/`
- Add a lightweight shared UI folder only for primitives repeated across multiple pages
- Keep `src/app/page.tsx` as the landing route and replace backend-foundation placeholder content with the visual landing experience

### 2. Create frontend integration layer

- Add a typed API client that understands the current backend envelope:
  - success shape `{ data, meta }`
  - error shape `{ error, meta }`
- Add shared request helpers for `GET`, `POST`, `PATCH`, and `DELETE`
- Normalize backend error responses for consistent UI handling
- Capture `correlationId` from responses for debugging surfaces where useful
- Avoid introducing a heavy client state library in the first pass unless route-by-route needs prove it necessary

### 3. Add actor bootstrap and access flow

- Implement actor resolution from `/api/v1/auth/session`
- Distinguish `anonymous`, `guest`, and `authenticated` actor states in frontend state handling
- Add guest bootstrap helper that creates a guest session before anonymous project creation
- Use NextAuth-backed login and logout integration only where already supported
- Gate save and export affordances according to current access rules

### 4. Build landing page with mockup fidelity

- Recreate the layout and visual rhythm from `design/HTML/landing-page-design-system.html`
- Wire supported top-nav and CTA routes:
  - `Sign In`
  - `Create Account`
  - `Start Free as Guest`
  - `Create Your Story`
  - `Dashboard`
  - `Projects`
  - `New Project`
- Keep unsupported footer and marketing triggers visible but disabled or marked coming soon
- Preserve existing visual treatment for disabled links and do not remove them from layout flow

### 5. Build authentication screens

- Recreate the authentication shell from `design/HTML/authentication-mvp.html`
- Build separate `/login` and `/signup` routes while preserving the visual tab treatment
- Wire credentials login against NextAuth credentials flow
- Wire Google auth only if provider credentials are configured
- Wire registration to `/api/v1/auth/register`
- Keep `Forgot?` visible but disabled until a real reset flow exists
- Add client-side form validation consistent with backend constraints

### 6. Build projects dashboard

- Recreate the projects dashboard from `design/HTML/saved-projects-dashboard-final.html`
- Load project data from the projects list API
- Implement card-level route wiring for:
  - open editor
  - continue editing
  - preview
- Keep export controls visible but disabled until export exists
- Keep filter UI visible only if it has a real frontend behavior; otherwise render it as disabled or passive
- Preserve the mobile and desktop CTA variants shown in the mockup

### 7. Build project creation flow

- Implement `/projects/new`
- Allow authenticated users to create projects directly
- For anonymous users, issue a guest session first and then create the project
- On successful project creation, redirect to `/projects/[projectId]/editor`
- Use project input fields that match the backend validator contract only:
  - `title`
  - `globalContext`
  - `stylePreset`

### 8. Build editor shell and scene management UI

- Recreate the editor layout from `design/HTML/project-editor-final-mvp.html`
- Build component groups for:
  - top navigation bar
  - project action bar
  - scene manager rail
  - center preview workspace shell
  - right-side inspector panel
- Load project and scene data from current project endpoints
- Wire supported actions:
  - save project title and global context
  - upload initiation and upload finalization
  - scene update
  - scene delete
  - scene retry
  - scene regenerate
  - scene reorder
  - preview navigation
- Keep unsupported controls visible but disabled:
  - export
  - notifications
  - depth focus controls if no persistence contract is added
- Keep `Generate` wired only if it can be truthfully mapped to existing processing behavior; otherwise render it as disabled and document why

### 9. Implement upload flow within current backend limits

- Build upload selection UI matching the mockup
- Use upload init endpoint to request upload contracts
- Use upload finalize endpoint to create scenes from uploaded assets
- Clearly isolate the temporary limitation that actual byte persistence is incomplete
- Do not fake successful full uploads if the storage pipeline is not actually present

### 10. Build preview page

- Recreate the preview experience with visual cues from the existing editor and landing mockups
- Load preview readiness from `/preview/status`
- Load playback data from `/preview/playback`
- Support reduced-motion playback only through the existing playback API capability
- Treat playback transport controls as frontend actions, not routes

### 11. Build settings page

- Recreate the settings page from `design/HTML/settings-page-design-system.html`
- Wire only currently supported session actions:
  - sign out
- Keep unsupported settings actions visible but disabled:
  - change password
  - sign out of all devices
  - reset defaults if no backend contract exists
  - user preference persistence if no settings API exists

### 12. Disabled and coming-soon trigger system

- Create a consistent disabled-trigger treatment that preserves visual fidelity
- Support `aria-disabled` and keyboard-safe non-interaction patterns
- Add optional lock or coming-soon text only where it fits the existing mockup language
- Prevent placeholder links from behaving like active navigation

### 13. Visual fidelity review pass

- Compare each implemented route against its source HTML mockup
- Validate spacing, typography, card structure, icon placement, and responsive behavior
- Correct any component abstractions that drift too far from the mockup look

### 14. Trigger audit closure

- Re-run the button and trigger audit after the first frontend implementation pass
- Mark every trigger as one of:
  - wired to route
  - wired to action
  - disabled or coming soon
  - deferred by backend dependency
- Update `docs/notes/button-trigger-route-audit.md` if assignments change

### 15. Validation and release checks

- Run the narrowest useful checks during page implementation
- Run `npm run lint` after material frontend changes
- Run `npm run build` once the first route set is in place
- Fix typed route, component boundary, and server-client issues before expanding scope

## Suggested Frontend Component Ownership

- `src/features/auth/components/`
  - `AuthShell`
  - `LoginForm`
  - `SignupForm`
  - `OAuthButton`
- `src/features/projects/components/`
  - `ProjectsDashboard`
  - `ProjectCard`
  - `NewProjectForm`
- `src/features/scenes/components/`
  - `SceneRail`
  - `SceneCard`
  - `SceneInspector`
- `src/features/uploads/components/`
  - `UploadPanel`
  - `UploadDropzone`
- `src/features/preview/components/`
  - `PreviewShell`
  - `PreviewPlayer`
- `src/features/settings/components/`
  - `SettingsShell`
  - `SettingsForm`

## Backend Contract References

- `src/interfaces/http/controllers/auth-controller.ts`
- `src/interfaces/http/controllers/guest-session-controller.ts`
- `src/interfaces/http/controllers/project-controller.ts`
- `src/interfaces/http/controllers/scene-controller.ts`
- `src/interfaces/http/controllers/upload-controller.ts`
- `src/interfaces/http/controllers/preview-controller.ts`
- `src/modules/projects/validator.ts`
- `src/modules/scenes/validator.ts`
- `src/modules/uploads/validator.ts`

## Definition Of Done For The First Frontend Build Phase

- Approved page routes exist and render successfully
- Supported triggers are wired to real routes or actions
- Unsupported triggers remain visible and are rendered as disabled or coming soon
- Guest and authenticated entry paths work through supported backend contracts
- Project creation, listing, editing, and preview routes are functional within current backend limits
- The visual output stays close to the provided HTML mockups on desktop and mobile
