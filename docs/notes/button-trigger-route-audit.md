# Button And Trigger Route Audit

## Purpose

This document audits the interactive triggers in the HTML mockups under `design/HTML/` and maps each trigger to:
- its current implementation state in the mockup
- its recommended canonical route or action target

This audit should be read alongside `docs/notes/canonical-app-route-structure.md`.

## Audit Legend

- `Current target`: what is wired in the HTML today
- `Canonical target`: the recommended route or action for implementation
- `Type`: `route` or `action`

## authentication-mvp.html

Source: `design/HTML/authentication-mvp.html`

| Trigger | Current target | Canonical target | Type | Notes |
| --- | --- | --- | --- | --- |
| Log In tab | none | `/login` or tab state | route/action | Use route if login and signup are separate pages |
| Sign Up tab | none | `/signup` or tab state | route/action | Use route if login and signup are separate pages |
| Continue with Google | none | `/api/auth/signin/google` | route | OAuth entrypoint |
| Forgot? | `#` | `/forgot-password` | route | Password reset entry |
| Password visibility toggle | none | Toggle password visibility | action | Pure UI behavior |
| Enter Studio | form submit disabled | Redirect to `/dashboard` or `/projects` after auth | action | Successful login action |
| Create an account | `#` | `/signup` | route | Auth conversion path |

## landing-page-design-system.html

Source: `design/HTML/landing-page-design-system.html`

| Trigger | Current target | Canonical target | Type | Notes |
| --- | --- | --- | --- | --- |
| Dashboard | `#` | `/dashboard` | route | Authenticated destination |
| Projects | `#` | `/projects` | route | Saved projects dashboard |
| New Project | `#` | `/projects/new` | route | New project entry |
| Sign In | none | `/login` | route | Public auth entry |
| Start Free as Guest | none | `/projects/new?mode=guest` | route | Guest-first creation flow |
| Create Account | none | `/signup` | route | Public auth signup |
| Already have an account? Log In | `#` | `/login` | route | Alternate auth entry |
| Unlock Full Features | none | `/signup` | route | Can later branch to billing or upgrade |
| Create Your Story | none | `/projects/new` | route | Primary CTA |
| Footer social links | `#` | External links or placeholders | route | Needs product decision |
| Features | `#` | `/docs` or marketing section anchor | route | Could be in-page anchor on landing |
| Tutorials | `#` | `/docs` | route | Documentation or learning hub |
| Gallery | `#` | `/gallery` if added later | route | Not required for MVP |
| Pricing | `#` | `/pricing` if added later | route | Not required for MVP |
| Documentation | `#` | `/docs` | route | Static/support page |
| API Reference | `#` | `/api-reference` | route | Static/support page |
| Community | `#` | `/community` if added later | route | Optional future route |
| Support | `#` | `/support` | route | Static/support page |
| Privacy Policy | `#` | `/privacy` | route | Static/support page |
| Terms of Service | `#` | `/terms` | route | Static/support page |

## project-editor-final-mvp.html

Source: `design/HTML/project-editor-final-mvp.html`

| Trigger | Current target | Canonical target | Type | Notes |
| --- | --- | --- | --- | --- |
| Dashboard | `#` | `/dashboard` | route | Top nav |
| Projects | `#` | `/projects` | route | Top nav |
| New Project | `#` | `/projects/new` | route | Top nav |
| Notifications | none | Open notifications panel | action | No page route needed |
| Back arrow | none | `/projects` | route | Return to project list |
| Save | none | Save current project | action | Stay on current editor route |
| Preview | none | `/projects/:projectId/preview` | route | Full project preview |
| Export | none | `/projects/:projectId/export` | route | Auth-gated route |
| Generate | none | Start processing pipeline | action | Async generation trigger |
| Upload Images | none | Open file picker and upload flow | action | In-editor mutation |
| Scene refresh | none | Reprocess scene | action | Per-scene regenerate action |
| Scene delete | none | Delete scene from project | action | Confirm before destructive mutation |
| Player previous | none | Jump to previous scene or segment | action | Local playback control |
| Player play | none | Toggle preview playback | action | Local playback control |
| Player next | none | Jump to next scene or segment | action | Local playback control |
| Scene tab | none | Show scene settings panel | action | In-page tab state |
| Project tab | none | Show project settings panel | action | In-page tab state |
| Depth focus: Subject | none | Set scene depth focus | action | In-page control |
| Depth focus: Balanced | none | Set scene depth focus | action | In-page control |
| Depth focus: Background | none | Set scene depth focus | action | In-page control |
| Reduced Motion toggle | none | Toggle project preference | action | In-page preference update |
| Reprocess Scene | none | Start scene reprocessing | action | Async mutation |

## saved-projects-dashboard-final.html

Source: `design/HTML/saved-projects-dashboard-final.html`

| Trigger | Current target | Canonical target | Type | Notes |
| --- | --- | --- | --- | --- |
| Dashboard | `#` | `/dashboard` | route | Top nav |
| Projects | `#` | `/projects` | route | Current page |
| New Project | `#` | `/projects/new` | route | Top nav |
| New Project button | none | `/projects/new` | route | Desktop CTA |
| Create New Sequence | none | `/projects/new` | route | Mobile CTA |
| Filter | none | Open filter controls | action | In-page UI behavior |
| Misty Peaks Cinematic - Open Editor | none | `/projects/:projectId/editor` | route | Project editor entry |
| Misty Peaks Cinematic - Preview | none | `/projects/:projectId/preview` | route | Project preview |
| Misty Peaks Cinematic - Export | none | `/projects/:projectId/export` | route | Auth-gated export |
| Neon District 2077 - Processing | disabled | none | action | Intentionally unavailable |
| Neon District 2077 - Preview | none | `/projects/:projectId/preview` | route | Optional if preview exists during processing |
| Neon District 2077 - Delete | none | Delete project | action | Confirm before destructive mutation |
| Desert Mirage - Continue Editing | none | `/projects/:projectId/editor` | route | Draft continuation |
| Desert Mirage - Preview | none | `/projects/:projectId/preview` | route | Project preview |
| Desert Mirage - Delete | none | Delete project | action | Confirm before destructive mutation |
| Cyber Cityscape - Open Editor | none | `/projects/:projectId/editor` | route | Project editor entry |
| Cyber Cityscape - Preview | none | `/projects/:projectId/preview` | route | Project preview |
| Cyber Cityscape - Export | none | `/projects/:projectId/export` | route | Auth-gated export |
| Empty state New Project | none | `/projects/new` | route | Project creation entry |
| Documentation | `#` | `/docs` | route | Footer |
| API Reference | `#` | `/api-reference` | route | Footer |
| Support | `#` | `/support` | route | Footer |
| Terms | `#` | `/terms` | route | Footer |

## settings-page-design-system.html

Source: `design/HTML/settings-page-design-system.html`

| Trigger | Current target | Canonical target | Type | Notes |
| --- | --- | --- | --- | --- |
| Home | `#` | `/dashboard` | route | Main app home |
| Projects | `#` | `/projects` | route | Project list |
| New Project | `#` | `/projects/new` | route | Creation flow |
| Settings | `#` | `/settings` | route | Current page |
| Notifications | none | Open notifications panel | action | In-app panel |
| Change Password | none | `/settings/security` or modal | route/action | Start with modal if simpler |
| Reduced Motion toggle | none | Update user preference | action | Persist preference |
| Story Pace select | none | Update user preference | action | Persist preference |
| Transition Style select | none | Update user preference | action | Persist preference |
| Motion Preset select | none | Update user preference | action | Persist preference |
| Sign Out of All Devices | none | POST sign-out-all action | action | Destructive session action |
| Save Changes | none | Save settings | action | Stay on `/settings` |
| Reset Defaults | none | Reset preferences | action | Confirm if destructive |
| Sign Out | none | POST `/api/auth/signout`, then `/login` | action | Session exit flow |

## Canonical Route Inventory Extracted From Audit

Routes repeatedly implied by the mockups:

- `/`
- `/login`
- `/signup`
- `/forgot-password`
- `/dashboard`
- `/projects`
- `/projects/new`
- `/projects/:projectId/editor`
- `/projects/:projectId/preview`
- `/projects/:projectId/export`
- `/settings`
- `/settings/security`
- `/docs`
- `/api-reference`
- `/support`
- `/terms`
- `/privacy`

Optional later additions suggested by some labels:

- `/gallery`
- `/pricing`
- `/community`

## Implementation Guidance

- Replace all placeholder `href="#"` links with canonical destinations when those routes are implemented
- Keep save, generate, upload, delete, retry, toggle, playback, and panel-opening controls as in-page actions rather than routes
- Gate save and export actions for guests and route them into auth or upgrade flows as needed
- Use project-scoped dynamic routes for editor, preview, and export so project cards and editor actions resolve consistently

## Decision Summary

The mockups currently function as visual-only prototypes, not route-wired screens. This audit converts each visible trigger into a consistent route or action target so implementation can proceed without inventing navigation ad hoc.
