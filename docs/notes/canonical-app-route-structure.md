# Canonical App Route Structure

## Purpose

This document defines the canonical application route structure for Parallax Story Composer based on the current PRD and the HTML mockups in `design/HTML/`.

It is intended to:
- align navigation across landing, auth, projects, editor, preview, and settings
- give button and trigger audits a source of truth
- separate page routes from in-page actions and modal flows
- support guest preview and authenticated save/export gating

## Route Design Principles

- Use top-level routes only for real pages with standalone navigation value
- Keep editing and processing actions inside the current page when they do not need a dedicated URL
- Use project-scoped routes for editor, preview, and export-related screens
- Keep auth flows explicit and separate from product pages
- Preserve guest access for preview and build flows while gating save and export behind auth
- Prefer stable, semantic routes over UI-label-driven routes

## Canonical Route Map

### Public Routes

- `/`
  - Primary landing page
  - Corresponds to the landing mockup
  - Entry point for guest or authenticated users

- `/login`
  - Email and password sign in
  - Supports redirect back into app after auth

- `/signup`
  - Account creation

- `/forgot-password`
  - Password reset request flow

### Auth And Session Routes

- `/api/auth/signin`
  - Auth provider entrypoint if using NextAuth
- `/api/auth/signout`
  - Sign out endpoint
- `/api/auth/callback/:provider`
  - OAuth callback route
- `/api/auth/session`
  - Session lookup endpoint

Recommended OAuth trigger target:
- Google sign-in button -> `/api/auth/signin/google`

### App Shell Routes

- `/dashboard`
  - High-level home for authenticated users
  - Can later show recent projects, processing jobs, and quick actions

- `/projects`
  - Saved projects dashboard
  - Corresponds to the saved projects mockup

- `/projects/new`
  - New project entry route
  - Can initialize guest or authenticated project creation
  - Best target for `New Project`, `Create Your Story`, and `Start Free as Guest`

### Project-Scoped Routes

- `/projects/:projectId`
  - Project overview shell
  - Optional redirect route
  - Recommended behavior: redirect to `/projects/:projectId/editor`

- `/projects/:projectId/editor`
  - Main project editing interface
  - Corresponds to the editor mockup
  - Includes scene manager, project settings, upload, reorder, prompt editing, and generation triggers

- `/projects/:projectId/preview`
  - Full stitched preview page
  - Useful when preview should be shareable or opened independently of editor

- `/projects/:projectId/export`
  - Export screen for authenticated users
  - If export is not enabled yet, route can show gated or coming soon state

- `/projects/:projectId/settings`
  - Optional project-specific settings page if editor tabs become too dense
  - Not required for MVP if project settings remain inside editor sidebar

### Scene-Oriented Optional Routes

These are optional and should only exist if deep-linking is needed.

- `/projects/:projectId/scenes/:sceneId`
  - Scene details anchor route
- `/projects/:projectId/scenes/:sceneId/preview`
  - Scene preview route
- `/projects/:projectId/scenes/:sceneId/reprocess`
  - Usually better as an action, not a page

Recommendation:
- For MVP, keep scene operations in-page and avoid dedicated scene page routes unless deep-linking becomes necessary

### User Settings Routes

- `/settings`
  - Main user settings page
  - Corresponds to the settings mockup

- `/settings/security`
  - Optional future route for password and session controls

- `/settings/preferences`
  - Optional future route if settings expand significantly

For MVP:
- Keep all current settings under `/settings`

### Static And Support Routes

- `/docs`
- `/api-reference`
- `/support`
- `/terms`
- `/privacy`

These align with footer links seen in the mockups.

## Canonical Trigger To Route Mapping

### Landing Page

- `Dashboard` -> `/dashboard`
- `Projects` -> `/projects`
- `New Project` -> `/projects/new`
- `Sign In` -> `/login`
- `Start Free as Guest` -> `/projects/new?mode=guest`
- `Create Account` -> `/signup`
- `Already have an account? Log In` -> `/login`
- `Create Your Story` -> `/projects/new`
- `Unlock Full Features` -> `/signup` for guests, `/settings/billing` later if billing exists

### Authentication Page

- `Log In` tab -> `/login` or in-page tab state
- `Sign Up` tab -> `/signup` or in-page tab state
- `Continue with Google` -> `/api/auth/signin/google`
- `Forgot?` -> `/forgot-password`
- `Enter Studio` -> redirect to `/dashboard` or `/projects` after successful login
- `Create an account` -> `/signup`

Recommendation:
- Use separate page routes for `/login` and `/signup`
- Use tab UI only if both forms remain on one shared auth page

### Saved Projects Dashboard

- `Dashboard` -> `/dashboard`
- `Projects` -> `/projects`
- `New Project` -> `/projects/new`
- `Open Editor` -> `/projects/:projectId/editor`
- `Continue Editing` -> `/projects/:projectId/editor`
- `Preview` -> `/projects/:projectId/preview`
- `Export` -> `/projects/:projectId/export`
- `New Project` empty state -> `/projects/new`

### Editor

- `Dashboard` -> `/dashboard`
- `Projects` -> `/projects`
- `New Project` -> `/projects/new`
- Back arrow -> `/projects`
- `Preview` -> `/projects/:projectId/preview`
- `Export` -> `/projects/:projectId/export`

Recommendation:
- `Save`, `Generate`, `Upload Images`, `Reprocess Scene`, `Delete Scene`, `Refresh Scene`, playback controls, and tab switches should remain in-page actions, not routes

### Settings

- `Home` -> `/dashboard`
- `Projects` -> `/projects`
- `New Project` -> `/projects/new`
- `Settings` -> `/settings`
- `Change Password` -> `/settings/security` or modal
- `Sign Out` -> POST `/api/auth/signout`, then redirect to `/login`

## Route Versus Action Rules

Use a route when:
- the destination is a standalone page
- the URL should be shareable or bookmarkable
- browser back and forward should preserve the state
- the content has distinct information architecture value

Use an in-page action when:
- the user is mutating current page state
- the trigger opens a modal, panel, picker, or tab
- the action starts processing, saving, uploading, reordering, or retrying
- the user should stay in context

## Recommended MVP Route Set

Implement first:

- `/`
- `/login`
- `/signup`
- `/forgot-password`
- `/dashboard`
- `/projects`
- `/projects/new`
- `/projects/:projectId/editor`
- `/projects/:projectId/preview`
- `/settings`

Defer until needed:

- `/projects/:projectId/export`
- `/settings/security`
- `/docs`
- `/api-reference`
- `/support`
- `/terms`
- `/privacy`

## Notes For Next.js App Router

Recommended folder shape:

- `src/app/page.tsx` -> `/`
- `src/app/login/page.tsx` -> `/login`
- `src/app/signup/page.tsx` -> `/signup`
- `src/app/forgot-password/page.tsx` -> `/forgot-password`
- `src/app/dashboard/page.tsx` -> `/dashboard`
- `src/app/projects/page.tsx` -> `/projects`
- `src/app/projects/new/page.tsx` -> `/projects/new`
- `src/app/projects/[projectId]/editor/page.tsx` -> `/projects/:projectId/editor`
- `src/app/projects/[projectId]/preview/page.tsx` -> `/projects/:projectId/preview`
- `src/app/settings/page.tsx` -> `/settings`

## Decision Summary

Canonical navigation should center around:
- public entry at `/`
- explicit auth routes
- project collection at `/projects`
- creation at `/projects/new`
- editing at `/projects/:projectId/editor`
- preview at `/projects/:projectId/preview`
- user settings at `/settings`

This structure best matches the PRD, supports guest and authenticated flows, and gives the current HTML button audit a stable routing target model.
