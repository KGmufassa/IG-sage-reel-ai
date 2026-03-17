# Settings Page

Design the Settings Page for `Parallax Story Composer`.

Use the shared design system in `design/webpages/00-shared-design-system.md` exactly.

## Route

`/settings`

## Purpose

- Give authenticated users a dedicated place to manage account details and app preferences
- Keep account and preferences separate from project creation and editing workflows
- Provide default settings that influence future editor and preview behavior

## Primary User Flow

1. Authenticated user opens settings from the global navbar
2. User reviews account information
3. User updates app preferences
4. User saves changes or resets defaults
5. User returns to the dashboard or an active project workflow

## Required Layout

- Consistent global navbar
- Header section with page title and supporting copy
- Two-column or stacked settings layout depending on breakpoint
- Clear separation between account settings and app preferences
- Persistent action area for save and reset actions

## Navbar Requirement

- Use the shared global navbar exactly
- Keep `Product`, `Dashboard`, `New Project`, and `Settings` naming consistent with the rest of the app
- `Product` routes to `/`
- `Dashboard` routes to `/projects`
- `New Project` creates a project and routes to `/editor/[projectId]`
- `Settings` routes to `/settings`

## Required Sections

### 1. Page Header

- Title like `Settings`
- Supporting text explaining that this page controls account information and default creative preferences

### 2. Account Information

- `Display Name` input
- `Email` field
- Authentication provider display
- Password management note or action if supported by the auth provider

### 3. App Preferences

- `Reduced Motion` default toggle
- `Default Story Pace` selector:
  - `Calm`
  - `Balanced`
  - `Fast`
- `Default Transition Style` selector:
  - `Fade Depth`
  - `Soft Lift`
  - `Crossfade Scale`
- `Default Motion Preset` selector:
  - `Cinematic Push`
  - `Ambient Float`
  - `Hero Reveal`
  - `Dramatic Depth`
- `Output Format` display locked to `9:16`

### 4. Session

- Sign-out area with a clear but restrained destructive action style

## Required Buttons

- `Save Changes`
- `Reset Defaults`
- `Sign Out`

## Interaction Intent

- `Save Changes` persists account and preference updates
- `Reset Defaults` restores preference values to system defaults
- `Sign Out` ends the current authenticated session
- Preference changes should affect future project/editor/player defaults, not destructively overwrite existing project-specific settings

## Design Notes

- Keep the page premium, clean, and aligned with the dark grey and neon green theme
- Make settings feel creator-oriented rather than enterprise/accounting-oriented
- Use strong section hierarchy and calm form design
- The page should feel lighter than the editor but still part of the same system
