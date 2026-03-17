# PRD Draft

## App Concept

Parallax Story Composer is a vertical-first web application that transforms multiple static images into a stitched parallax scrolling story. Users upload several images, turn each one into a scene, arrange scene order, add context describing what is happening, and generate a dynamic mobile-first preview.

---

## Problem Statement

Creators and marketers often have strong still imagery but lack an easy way to convert those assets into polished motion content for vertical social platforms. Existing workflows usually require video editing, manual compositing, or advanced motion tools. This app reduces that complexity by automating layer decomposition, motion planning, and stitched parallax playback.

---

## Target Users

- Creators making Instagram and TikTok style visual stories
- Social media marketers creating lightweight campaign motion content
- Designers prototyping cinematic motion from still images

---

## Core Features

- Guest or authenticated entry flow
- Multi-image upload in a single project
- One scene created per uploaded image
- Scene building workflow for turning uploads into processed scenes
- Scene manager for ordering, editing, deleting, and regenerating scenes
- Drag-and-drop scene ordering
- Scene-level context input describing content and desired output feel
- Project-level style or story direction
- AI-powered image decomposition into layered RGBA assets
- Motion blueprint generation for each scene
- Scroll engine for stitched vertical playback across all scenes
- Stitched vertical parallax preview in a continuous scrolling experience
- Save and export gated to authenticated users

---

## Supporting Features

- Scene status tracking for upload, processing, ready, and failed states
- Scene storage for originals, thumbnails, layered assets, and playback plans
- Retry and selective regeneration for individual scenes
- User editing interface with portrait scene cards and preview controls
- Mobile-first pinned vertical preview player
- Mobile capability tuning for touch input, responsive playback, and reduced motion
- Reduced motion support
- Guest preview mode with auth gate for save and export

---

## Platform

Web application optimized for vertical social and reel-style playback.

---

## UI / Theme Ideas

- Vertical-first `9:16` preview stage
- Mobile-inspired reel player centered in the interface
- Scene card editor with portrait thumbnails
- Drag-and-drop storyboard workflow
- Clean creator-tool interface focused on upload, sequencing, and preview

---

## Integrations

- Qwen-Image-Layered for layered image decomposition
- S3-compatible object storage for uploaded and generated assets
- Authentication provider for account creation and login
- PostgreSQL for persistent project and scene data
- Job orchestration system for async processing

---

## Data Model Hints

- Users
- Guest sessions
- Projects
- Dashboard views
- Scenes
- Scene thumbnails
- Scene assets
- Scene instructions
- Processing jobs
- Playback plans
- Export records

---

## Product Assumptions and Risks

- Decomposition quality will vary depending on image type and composition
- Portrait-safe framing is critical because the output format is vertical-first
- Mobile performance may degrade if scene count or layer count grows too large
- Async job orchestration is required because inference will not be instant
- Context text should influence motion planning, not direct per-layer semantic control

---

## Recommended MVP Definition

- Format: vertical `9:16`
- Output: interactive browser-based stitched parallax preview
- Upload range: `3-10` images per project
- Layer target: `3-6` ideal, `8` maximum per scene
- Guest access: preview only
- Authenticated access: save, revisit, regenerate, and export
- Scroll engine drives the continuous project timeline
- Scene manager and editing interface are first-class MVP surfaces
- Scene storage differs for guest and authenticated users

---

## Refined MVP Direction

The MVP should focus on a browser-based vertical story composer rather than a video export tool. The core value is turning a sequence of still images into one continuous, stitched parallax experience by combining four logical systems:

- Decomposition service to create layered RGBA assets
- Motion service to generate scene movement blueprints
- Planner service to stitch scene pacing and transitions into one timeline
- Parallax renderer to execute the timeline in a pinned vertical player

---

## MVP Page Architecture

- Product page at `/`
- Authentication page at `/auth`
- Dashboard at `/projects`
- Project editor page at `/editor/[projectId]`
- Preview/player page at `/preview/[projectId]`
- Settings page at `/settings`

The navbar should use:
- `Product`
- `Dashboard`
- `New Project`
- `Settings`

Each created project should route to its own dedicated editor page.
