# Frontend Plan

## Overview
This folder contains the frontend build planning documents for Parallax Story Composer.

## Documents
- [Frontend Build Task List](./frontend-build-task-list.md) - detailed UI build plan, trigger wiring scope, backend integration dependencies, and unsupported trigger handling rules

## Planning Constraints
- Stay visually close to the mockups in `design/HTML/*.html`
- Wire only triggers backed by existing routes or backend contracts
- Preserve unsupported triggers visually and show them as disabled or coming soon
- Keep route entrypoints thin and place feature behavior in reusable frontend modules

## Current Source Documents
- `docs/notes/canonical-app-route-structure.md`
- `docs/notes/button-trigger-route-audit.md`
- `design/HTML/authentication-mvp.html`
- `design/HTML/landing-page-design-system.html`
- `design/HTML/project-editor-final-mvp.html`
- `design/HTML/saved-projects-dashboard-final.html`
- `design/HTML/settings-page-design-system.html`
