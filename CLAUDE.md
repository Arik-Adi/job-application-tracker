# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:4200 (hot reload)
npm run build      # Production build → dist/dev-step/
npm run watch      # Watch mode build (development config)
npm test           # Unit tests via Karma/Jasmine
```

No lint script is configured in package.json.

## Architecture

**Angular 19** app using standalone components, experimental zoneless change detection, and lazy-loaded routes.

### State Management

Single `JobStore` (`src/app/store/job.store.ts`) built with `@ngrx/signals`. It handles all job CRUD and owns the persistence strategy:

- **Guest users**: reads/writes to `localStorage`
- **Authenticated users**: reads/writes to Firestore subcollection `users/{uid}/jobs/{jobId}`

The store watches `AuthService.user$` and calls `_syncJobs()` on auth changes. Firestore `Timestamp` fields are converted to JS `Date` on read.

### Routes & Views

```
/dashboard  → DashboardComponent   (auth controls + stats)
/jobs       → JobsGridComponent    (searchable, sortable table)
/pipeline   → PipelineComponent    (Kanban board, CDK drag-drop)
```

All routes are lazy-loaded via `loadComponent`. The `AddJobDialog` is an overlay component opened from both Grid and Pipeline views.

### Key Dependencies

| Library | Purpose |
|---|---|
| `@ngrx/signals` | Signal-based store |
| Firebase / `@angular/fire` | Auth (Google OAuth), Firestore, Storage |
| `@angular/cdk` | Drag-drop (Pipeline), Dialogs |
| Tailwind CSS 3 | Styling (entry: `src/styles.css`) |
| `@ngx-translate` | i18n (translations in `public/assets/i18n/en.json`) |

### Component Conventions

- All components are **standalone** — import dependencies directly, no NgModules.
- Shared reusable UI lives in `src/app/shared/components/` (Button, ConfirmationDialog, PageHeader).
- Singleton services and guards live in `src/app/core/`.
- Data shapes are in `src/app/models/job.model.ts` — the `Job` interface is the canonical type used throughout.

### Firebase Config

Firebase is initialized in `app.config.ts` and pulls from `src/environments/environment.ts` (not committed). The file exports a `firebaseConfig` object.

### Forms

The `AddJobDialog` uses Angular Reactive Forms (`FormBuilder`). File uploads (resumes) go to Firebase Storage and the download URL is stored on the `Job` document.

### HTTP Interceptors

Two functional interceptors registered in `app.config.ts`:
- `loggingInterceptor` — logs all requests/responses
- `errorInterceptor` — catches and logs HTTP errors

### TypeScript

Strict mode is enabled (`tsconfig.json`). Target is ES2022.
