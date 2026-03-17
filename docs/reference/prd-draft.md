# Draft PRD
## Product Name
Parallax Story Composer

## Document Status
Draft

## Product Summary
Parallax Story Composer is a vertical-first web app that turns multiple uploaded static images into one continuous, stitched parallax scrolling experience. Users upload several images, arrange them into scene order, describe what is happening in each scene, and generate a dynamic mobile-first visual story preview. Logged-in users can save projects and export outputs; guests can preview only.

## Problem Statement
Creating motion from static images usually requires advanced editing tools, timeline software, or manual compositing. Most creators do not have an easy way to turn a set of images into a polished, depth-driven, vertically formatted storytelling experience for social platforms.

## Vision
Enable creators to transform still images into immersive vertical parallax stories with minimal manual editing by combining AI-based layer decomposition, motion planning, scene stitching, and a browser-based parallax renderer.

## Goals
- Let users upload multiple images in one session
- Turn each image into an ordered scene
- Allow users to reorder scenes before generation
- Capture scene-level and project-level creative intent through text context
- Decompose images into layered RGBA assets using AI
- Generate motion blueprints for each scene
- Stitch all scenes into one continuous vertical scrolling experience
- Provide a polished interactive preview in the browser
- Require login for save and export capabilities

## Non-Goals
- Full manual layer-by-layer editing in MVP
- Video export in the first release
- Collaborative editing
- Recursive decomposition UI
- Advanced semantic object editing
- WebGL-first rendering architecture

## Target Users
- Content creators making Instagram and TikTok style visual stories
- Social media marketers producing lightweight campaign motion content
- Designers who want a faster way to prototype layered motion from stills

## MVP Success Criteria
- User can upload 3-10 images
- Each image becomes a separate scene
- User can reorder scenes
- User can add context to each scene
- App can process scenes asynchronously into layered assets
- App can generate a stitched vertical parallax preview
- Logged-in users can save projects
- Guests can preview but cannot save or export

## User Types
### Guest User
Can:
- Upload images
- Reorder scenes
- Add scene context
- Generate and preview parallax output

Cannot:
- Save projects
- Export outputs
- Return to projects later

### Authenticated User
Can:
- Do everything a guest can do
- Save projects
- Return to prior projects
- Regenerate scenes
- Export outputs when export is enabled

## Core User Flow
1. User lands on the app
2. User chooses guest mode or logs in
3. User uploads multiple images
4. App creates one scene per image
5. User reorders scenes
6. User adds scene-level context and optional project-level direction
7. Planner queues image decomposition jobs
8. Decomposition service generates RGBA layers for each scene
9. Motion service creates scene motion blueprints
10. Planner stitches scenes into one playback plan
11. Parallax renderer shows one continuous vertical scrolling preview
12. Logged-in users may save and later export

## Functional Requirements

### 1. Authentication and Access
- Support guest mode
- Support account creation and login
- Support persistent saved projects for authenticated users only
- Prevent guest save/export actions
- Show login gate when guest tries to save or export

### 2. Project Creation
- User can create a new project
- Project defaults to vertical `9:16` format
- Project stores:
  - title
  - global context
  - style preset
  - playback plan version

### 3. Multi-Image Upload
- User can upload multiple images at once
- Supported formats: JPG, PNG, WebP
- Each uploaded image becomes a new scene
- Scenes are assigned an initial order automatically
- App generates scene thumbnails after upload

### 4. Scene Management
- User can reorder scenes using drag-and-drop
- User can delete a scene before generation
- User can edit per-scene context text
- User can assign simple motion style/intensity controls
- Scene status must be visible:
  - uploaded
  - queued
  - processing
  - ready
  - failed

### 5. Context Input
- Each scene has a context box describing:
  - what is happening
  - desired feel or emphasis
  - optional motion style
- Project has a global context field describing the full output intent
- Context should influence motion planning, not direct layer semantics

### 6. Decomposition Service
- System must asynchronously process each uploaded image
- AI decomposition must return multiple RGBA layers
- System stores:
  - original image
  - layer assets
  - preview composite
  - layer metadata
- System should support a practical layer range for MVP, ideally 3-6 layers and no more than 8

### 7. Motion Service
- System generates a structured motion blueprint for each scene
- Motion blueprint must include:
  - camera movement type
  - motion intensity
  - per-layer parallax behavior
  - transition hints
- Initial implementation should be rule-based with presets, not fully generative

### 8. Planner and Stitching
- Planner must assemble scenes into one continuous playback plan
- Planner must account for:
  - scene order
  - pacing
  - overlap between scenes
  - transitions
  - continuity of motion intensity
- Planner should support selective regeneration of a single scene without recreating the whole project when possible

### 9. Parallax Renderer
- Renderer must be vertical-first and optimized for `9:16`
- Renderer must use a pinned vertical viewport
- Renderer must stitch scenes into one continuous dynamic scrolling experience
- Renderer must support:
  - layered RGBA scene rendering
  - depth-based motion
  - scene overlap transitions
  - mobile-friendly performance behavior

### 10. Save and Export
- Save is available only to authenticated users
- Export is available only to authenticated users
- Guests can preview only
- MVP may gate export UI if final export implementation lands after preview/save

### 11. Scroll Engine
- The system must include a scroll engine that converts page scroll and touch input into normalized project and scene progress
- The scroll engine must drive a pinned vertical `9:16` viewport for preview playback
- The scroll engine must support continuous stitched playback across multiple scenes rather than isolated scene playback
- The scroll engine must support scene overlap windows, transition timing, and smooth progression through the full project timeline

### 12. Scene Manager
- The application must include a scene manager responsible for creating, ordering, editing, deleting, and regenerating scenes within a project
- The scene manager must display portrait-oriented scene cards with status, thumbnail, context, and motion settings
- The scene manager must allow drag-and-drop ordering and preserve the final order in the planner playback plan
- The scene manager must support per-scene retry and selective regeneration after failed processing

### 13. Mobile Capabilities
- The application must be optimized first for mobile vertical use cases and reel-style viewing
- The preview player must support touch-friendly controls, responsive layout behavior, and stable portrait playback
- The system must degrade gracefully on lower-powered mobile devices by reducing active layers, motion intensity, or asset resolution as needed
- The application must support reduced-motion playback behavior on mobile and desktop

### 14. Scene Building Workflow
- Each uploaded image must be converted into a scene record with source media, thumbnail, context, framing data, and processing status
- Scene building must include decomposition, layer asset generation, motion blueprint creation, and final stitching into the project playback plan
- The system must preserve portrait-safe framing information for every scene to ensure consistent `9:16` playback
- The system should support rebuilding only the affected scene when user edits require regeneration

### 15. Scene Storage
- The system must store original uploads, generated thumbnails, layered assets, metadata, and playback plans
- Authenticated users must receive persistent project and scene storage
- Guest projects must use temporary storage with automatic expiration
- Scene storage must preserve versioned playback plans and generated assets so saved projects can be reopened accurately

### 16. User Editing Interface
- The application must provide a scene-based editing interface for upload, sequencing, context entry, motion selection, and preview
- The editing interface must include project-wide settings and per-scene controls
- The editing interface must surface processing state, validation errors, and retry actions clearly
- The editing interface must show the same portrait-oriented framing model used by the final renderer to avoid mismatches between editing and playback

### 17. Export Capabilities
- The product must reserve export as an authenticated-only capability
- The MVP must support export gating in the user interface even if final export implementation lands after the first preview/save release
- Export workflows must use the stitched project playback plan rather than isolated scene outputs
- Export scope after MVP may include downloadable stitched media or rendered outputs, but the first release should prioritize preview and save readiness

## Non-Functional Requirements

### Performance
- Optimize for mobile-first vertical playback
- Animate only transform and opacity in renderer
- Preload current, previous, and next scenes only
- Keep active layer count low enough for smooth playback
- Limit projects to manageable scene counts in MVP
- Keep the scroll engine and scene stitching smooth on mobile-first hardware targets

### Reliability
- All AI processing must be asynchronous
- Jobs must support retries, timeout handling, and failure states
- App must not block the entire project if one scene fails; it should surface the failure and allow retry

### Cost Control
- Limit scene count and image size in MVP
- Limit guest retention and guest processing usage
- Expire guest project assets automatically
- Avoid unnecessary reprocessing of unchanged scenes

### Security
- Authenticate save/export endpoints
- Restrict project access by owner
- Protect uploaded assets and generated outputs
- Never expose direct privileged storage credentials to clients

### Accessibility
- Support reduced motion mode in preview
- Ensure core UI is keyboard accessible
- Preserve readable controls on mobile and desktop

## Recommended Technical Architecture

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand
- dnd-kit
- Framer Motion
- zod

### Backend
- Next.js server routes or Node backend
- PostgreSQL
- Prisma
- Trigger.dev or Inngest
- S3-compatible storage

### AI / Processing
- Python GPU service
- Qwen-Image-Layered for decomposition
- Rule-based motion engine in backend for MVP

### Renderer
- Custom DOM/CSS transform runtime
- requestAnimationFrame-driven updates
- Pinned vertical `9:16` stage
- Browser-based interactive playback

## Core Data Model

### User
- id
- email
- auth_provider
- created_at

### Project
- id
- owner_id nullable for guest
- title
- global_context
- style_preset
- output_format
- status
- scroll_engine_version
- created_at
- updated_at

### Scene
- id
- project_id
- order_index
- source_image_url
- thumbnail_url
- context_text
- motion_preset
- motion_intensity
- status
- framing_data
- mobile_render_hints
- created_at
- updated_at

### SceneAsset
- id
- scene_id
- asset_type
- asset_url
- width
- height
- layer_order
- metadata_json

### ProcessingJob
- id
- scene_id
- job_type
- status
- attempt_count
- error_message
- started_at
- completed_at

### PlaybackPlan
- id
- project_id
- version
- timeline_json
- export_status
- created_at

## MVP Page Architecture

The MVP requires six core application pages to function properly. These pages support guest preview workflows, authenticated save and export workflows, and authenticated account and preferences management.

### 1. Landing Page
**Route:** `/`

**Purpose:**
Introduce the product, explain the value proposition, and let users begin as a guest or authenticate.

**Navbar Label:**
`Product`

**Key Functions:**
- Product overview
- Call to action to start a new project
- Guest entry option
- Sign up and log in entry points
- High-level explanation of save and export gating

**Primary Components:**
- Hero section
- Product explainer
- CTA buttons
- Authentication entry actions

### 2. Authentication Page
**Route:** `/auth`

**Purpose:**
Allow users to create an account or log in so they can save, revisit, and export projects.

**Key Functions:**
- Sign up
- Log in
- Session creation
- Return user to intended workflow after auth

**Primary Components:**
- Sign up form
- Log in form
- Auth state messaging
- Redirect handling

### 3. Project Editor Page
**Route:** `/editor/[projectId]`

**Purpose:**
Serve as the main workspace for building a parallax story project.

**Key Functions:**
- Multi-image upload
- Scene creation from uploaded images
- Scene manager with drag-and-drop ordering
- Scene context editing
- Project-wide style and output settings
- Scene processing state display
- Save gating for authenticated users
- Launch preview flow

**Primary Components:**
- Upload area
- Scene manager
- Scene cards
- Context input fields
- Motion and style controls
- Processing status UI
- Save and preview actions

### 4. Preview / Player Page
**Route:** `/preview/[projectId]`

**Purpose:**
Display the stitched vertical parallax experience in a dedicated playback environment.

**Key Functions:**
- Render the full stitched playback plan
- Drive the scroll engine
- Display continuous scene-to-scene transitions
- Support mobile-first `9:16` preview behavior
- Support reduced motion behavior

**Primary Components:**
- Pinned vertical stage
- Scroll engine runtime
- Scene renderer
- Transition layer
- Playback controls or return-to-editor action

### 5. Saved Projects Dashboard
**Route:** `/projects`

**Purpose:**
Allow authenticated users to view and reopen saved projects.

**Navbar Label:**
`Dashboard`

**Key Functions:**
- List saved projects
- Show project status and last updated time
- Open existing project in editor
- Open project preview
- Surface export access when available
- Create a new project from the dashboard and route directly to its dedicated editor page

**Primary Components:**
- Project list or grid
- Search or sorting controls
- Status indicators
- Open and edit actions
- Export entry points

### 6. Settings Page
**Route:** `/settings`

**Purpose:**
Allow authenticated users to manage account details and app preferences.

**Navbar Label:**
`Settings`

**Key Functions:**
- View and edit account details
- Manage default reduced motion behavior
- Manage default story pace
- Manage default transition style
- Manage default motion preset
- Sign out of the current session

**Primary Components:**
- Account information form
- Preferences panel
- Locked output format display
- Session actions

## Optional Future Pages

The following pages are not required for the MVP but may be added later as the app grows.

### Project Detail Page
**Route:** `/projects/[projectId]`

Used for separating project metadata, preview access, history, and export actions from the editor.

### Export Page
**Route:** `/export/[projectId]`

Used if export becomes a more advanced workflow with format selection, queueing, delivery state, and download history.

## Page Architecture Recommendation

The MVP should launch with six core pages:
- Landing page
- Authentication page
- Saved projects dashboard
- Project editor page
- Preview and player page
- Settings page

The global navbar should use these labels:
- `Product` -> `/`
- `Dashboard` -> `/projects`
- `New Project` -> creates a project and routes to `/editor/[projectId]`
- `Settings` -> `/settings`

This page structure is sufficient for:
- guest preview workflows
- authenticated save workflows
- scene building and editing
- stitched parallax playback
- future export expansion

## Page-by-Page Product Flow

This section defines how users move through the MVP experience and how each page contributes to the core workflow.

### 1. Landing Page Product Flow

The landing page is the product entry point and must move users quickly into project creation.

It also functions as the `Product` destination in the global navbar.

**Primary User Journey:**
1. User arrives on the home page
2. User reads the core value proposition
3. User chooses whether to continue as a guest or authenticate
4. User starts a new project and enters the editor flow

**Primary Actions and Effects:**
- `Start Free as Guest`
  - Creates a temporary guest session
  - Creates or prepares a temporary project context
  - Routes user into the editor workflow
- `Create Account`
  - Routes user to the authentication page in sign-up mode
- `Log In`
  - Routes user to the authentication page in login mode
- `See How It Works`
  - Scrolls to an explainer section showing the upload, scene build, and preview workflow

**Business Purpose:**
- Convert visitors into active project creators
- Clearly communicate that preview is available to guests while save and export require login

### 2. Authentication Page Product Flow

The authentication page unlocks persistence, project ownership, and export rights.

**Primary User Journey:**
1. User enters sign-up or login flow
2. User completes authentication
3. App creates an authenticated session
4. User is returned to the intended destination, such as the editor or dashboard

**Primary Actions and Effects:**
- `Create Account`
  - Creates a user record
  - Starts an authenticated session
  - Redirects user to the next intended page
- `Log In`
  - Authenticates the user
  - Loads owned projects and permissions
  - Redirects user to the next intended page
- `Back to Product`
  - Returns user to the landing page at `/` without authenticating

**Business Purpose:**
- Gate save and export capabilities behind authenticated ownership
- Support a low-friction guest-to-account conversion path

### 3. Project Editor Page Product Flow

The project editor is the main production workspace where scenes are created, managed, and prepared for generation.

**Primary User Journey:**
1. User enters a project
2. User uploads multiple images
3. App creates one scene per image
4. User reorders scenes and adds context
5. User adjusts project-wide and scene-level settings
6. User triggers generation for new or changed scenes
7. User reviews processing status and moves to preview

**Primary Actions and Effects:**
- `Upload Images`
  - Opens file picker for multiple images
  - Creates scene records from uploaded files
  - Generates thumbnails and initial ordering
- `Add More Images`
  - Appends new scenes to the project
- `Select Scene`
  - Loads the selected scene into the editing panel
- `Drag Handle`
  - Reorders scenes
  - Updates scene order and marks the playback plan stale
- `Delete Scene`
  - Removes the scene from the project and triggers a future restitch
- `Scene Context Box`
  - Captures scene-specific intent
  - Marks the scene dirty for motion and planning updates
- `Motion Preset`
  - Assigns a scene motion style such as cinematic or ambient
- `Motion Intensity`
  - Adjusts movement strength for the scene
- `Project Context`
  - Captures overall output direction for the full story
- `Generate`
  - Queues decomposition and motion processing for all dirty or unprocessed scenes
- `Save Project`
  - Saves current state for authenticated users
  - Opens auth gate for guests
- `Preview`
  - Routes user to the player page using the latest available playback plan or preview state
- `Export`
  - Opens export flow for authenticated users when supported
  - Opens auth gate for guests
- `Retry` or `Regenerate Scene`
  - Requeues an individual scene for decomposition and motion generation

**Business Purpose:**
- Provide a single workspace for upload, sequencing, authoring, and generation
- Make scene management and editing intuitive enough for non-technical creators

### 4. Preview and Player Page Product Flow

The preview page presents the final stitched parallax output in a dedicated vertical playback environment.

**Primary User Journey:**
1. User opens preview from the editor or dashboard
2. App loads the latest playback plan
3. User scrolls through or restarts the stitched parallax experience
4. User decides whether to return to editing, save, or export

**Primary Actions and Effects:**
- `Back to Editor`
  - Returns user to the project editor
- `Restart Preview`
  - Resets playback to the beginning of the stitched timeline
- `Reduce Motion`
  - Enables lower-motion playback mode for accessibility and performance
- `Save`
  - Saves project state for authenticated users
  - Opens auth gate for guests
- `Export`
  - Opens export flow for authenticated users when export is available
  - Opens auth gate for guests

**Business Purpose:**
- Let users experience the final stitched narrative in the same vertical format it is designed for
- Create a clear decision point for saving, revising, or exporting

### 5. Saved Projects Dashboard Product Flow

The saved projects dashboard supports project retrieval, resumption, and ongoing management for authenticated users.

It functions as the `Dashboard` destination in the global navbar.

**Primary User Journey:**
1. Authenticated user enters the dashboard
2. User sees saved projects and their statuses
3. User opens a project in the editor or preview
4. User manages or deletes saved work

**Primary Actions and Effects:**
- `New Project`
  - Creates a new authenticated project and routes to that project's dedicated editor page at `/editor/[projectId]`
- `Open Editor`
  - Opens the selected project in the editor workspace
- `Preview`
  - Opens the selected project's player page
- `Export`
  - Starts export flow when supported and permitted
- `Delete Project`
  - Removes the project after confirmation
- `Sort` or `Filter`
  - Changes project list ordering or visibility

**Business Purpose:**
- Give authenticated users a persistent home for project management
- Reinforce the value of account creation beyond guest preview mode

### 6. Settings Page Product Flow

The settings page supports account maintenance and app-wide preference management for authenticated users.

It functions as the `Settings` destination in the global navbar.

**Primary User Journey:**
1. Authenticated user opens settings
2. User reviews account details
3. User updates default preferences
4. User saves changes or resets defaults
5. User returns to dashboard or project work with updated defaults applied to future workflows

**Primary Actions and Effects:**
- `Save Changes`
  - Persists account and preferences updates
- `Reset Defaults`
  - Restores preference values to system defaults
- `Sign Out`
  - Ends the current authenticated session

**Business Purpose:**
- Separate account and preferences management from project workflows
- Give users control over default creative behavior across the app

## Cross-Page Workflow Summary

The complete MVP product flow should behave as follows:

1. User enters through the landing page
2. User chooses guest mode or authentication
3. User creates a project in the editor
4. User uploads images and builds scenes
5. User triggers generation for decomposition and motion planning
6. Planner stitches the scenes into a playback plan
7. User reviews the result in the preview player
8. Guest users can preview only, while authenticated users can save, revisit, and export when available

## Global Navigation Routing

- `Product` routes to `/` and serves as the landing and marketing page
- `Dashboard` routes to `/projects` and serves as the project hub where users continue existing work or create new projects
- `New Project` creates a new project and routes immediately to `/editor/[projectId]`
- `Settings` routes to `/settings` and contains account and preferences only in the MVP
- Each created project has its own dedicated editor route at `/editor/[projectId]`

## MVP Constraints
- Vertical `9:16` format only
- 3-10 images per project
- 3-6 ideal layers per scene
- 8 layers maximum per scene
- Guest preview only
- No video export in first release
- No advanced layer editing in first release

## Risks
- Layer decomposition quality may vary by input image
- Landscape images may not frame well in portrait output without good focal handling
- Mobile performance may degrade if scene/layer counts exceed budget
- AI processing latency may impact UX if queueing is not well designed

## Risk Mitigations
- Restrict supported image types and size ranges
- Add fallback behavior for weak decomposition
- Cap scenes and layers
- Surface processing states clearly
- Use async jobs with retries and status tracking
- Start with deterministic motion presets and constrained transitions

## Open Questions
- Whether authenticated users can claim an in-progress guest project
- Exact export format for post-MVP release
- Whether save requires login before generation or only before persistence
- Whether project sharing should be supported after MVP

## Launch Scope
MVP launches as an interactive browser-based vertical parallax story composer with guest preview and authenticated save/export gating.
