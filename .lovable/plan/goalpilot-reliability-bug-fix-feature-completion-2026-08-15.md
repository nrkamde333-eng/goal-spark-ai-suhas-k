# GoalPilot — Reliability, Bug Fix & Feature Completion

Audit done on the existing code. The design system, routes, layouts and components stay exactly as they are. Only bugs, dead controls and dishonest copy get changed, plus the missing workload/balancing features.

## Confirmed problems found in the audit

- **AI planner (`app.planner.tsx`)**: every accepted plan is hardcoded `category: "study"` for the goal, its tasks and its events. "Add to calendar" calls the *same* `acceptPlan` handler as "Accept plan" — identical behavior, so it creates a goal, tasks, habits and events. Nothing prevents double-accept, so clicking twice duplicates everything. AI JSON isn't validated: a missing `milestones`/`dailyTasks`/`habits` array crashes the accept handler. `parseInt(plan.timeline)` silently mis-parses strings like "3 months". Start/end times are built as `9:00` (not zero-padded) on tasks while events pad correctly.
- **Analytics (`app.analytics.tsx`)**: weekly bars are `Math.sin/Math.cos`, the 12-month trend is synthetic, "Focus hours" is the literal constant `18.5`. Only the KPI counts and category pie use real state.
- **Dashboard (`app.index.tsx`)**: productivity score is an arbitrary `done/total*60 + streak*3` formula with no explanation; there is no workload/overload awareness and the AI suggestion is not state-derived.
- **Tasks (`app.tasks.tsx`)**: no edit UI at all — `updateTask` exists in the store but is unreachable. Delete has no confirmation. No estimated duration field. Filter functions are typed `any`.
- **Habits (`app.habits.tsx`)**: consistency is `log.length / 84` regardless of how long the habit has existed. Dates come from `toISOString().slice(0,10)`, which is UTC — after ~18:30 local (UTC+5:30) a completion lands on the wrong day.
- **Calendar (`app.calendar.tsx`)**: subtitle says "Drag your week around your goals" but there is no drag-and-drop. Tasks with times are only in the calendar because demo data duplicated them into `events`; newly created tasks never appear on the calendar.
- **Settings (`app.settings.tsx`)**: Name/Email/Timezone/Language are uncontrolled inputs and "Save changes" only fires a fake toast. "Export data" toasts "Exported" and exports nothing. Reset demo has no confirmation. Notification/email/AI toggles are fake switches.
- **Header (`app.tsx`)**: the search input is a dead control; the bell button opens nothing.
- **Landing (`index.tsx`)** claims "Drag, drop, reschedule. Never miss deadlines." and lists "Google Calendar sync" as a shipped Premium feature. **Auth**: "Continue with Google" looks functional.
- **Storage (`store.tsx`)**: `JSON.parse` of localStorage with no shape validation and no schema version — corrupt or older data can blank the app.

## What will be built

### New helper modules (business logic out of components)
- `src/lib/date-utils.ts` — local-time day keys (replaces UTC `toISOString().slice(0,10)`), safe ISO parsing, today/tomorrow/overdue helpers.
- `src/lib/workload.ts` — per-day workload from scheduled task times + `estimatedMinutes` + calendar events; status (`balanced` / `warning` / `overloaded`); balancing suggestions.
- `src/lib/analytics.ts` — real weekly/monthly series, completion rate, focus hours, habit consistency, goal progress, productivity score.
- `src/lib/notifications.ts` — derives notifications from state (overload, overdue, upcoming deadline, habit due, milestone).
- `src/lib/ai-plan.ts` — Zod validation + safe defaults for AI output, category inference, plan fingerprint for duplicate detection, offline fallback plan.
- `src/lib/storage.ts` — versioned, validated localStorage load/save with migration and safe defaults.

### Data model additions (backwards-compatible, migrated)
- `Task`: `estimatedMinutes?`, `planId?`.
- `Goal`: `planId?`; `Category` extended with `career`, `fitness`, `finance`, `business`, `learning`, `other`.
- `CalEvent`: `taskId?` so task↔event links are stable.
- `AppState`: `settings` (name, email, timezone, language, `dailyCapacityHours` default 8), `notifications` (read state), `schemaVersion`.

### Fixes per screen
- **Planner**: validated plan with defaults, inferred category, disabled/"Plan added" state after accept, `Add to calendar` limited to calendar events only, working Regenerate, inline validation for empty/too-short goals, request timeout with graceful fallback, buttons disabled while loading.
- **Tasks**: Edit dialog wired to `updateTask`, duration select (15m…2h + custom), delete confirmation, goal association, tags, real empty state, typed filters.
- **Calendar**: honest subtitle (click-based, no drag claim), event delete confirmation, scheduled tasks shown alongside events via `taskId` links, no duplicate entries.
- **Habits**: local-date completion, immediate streak/best-streak update, consistency based on days since habit start, heatmap from real log.
- **Analytics + Dashboard**: all numbers from `analytics.ts` (no `Math.sin`, no constants), memoized; productivity score = 40% task completion + 25% goal progress + 20% habit consistency + 15% schedule adherence, with an explanatory tooltip; contextual AI suggestion computed locally from overdue/overload/goal state.
- **Workload**: capacity banner on Dashboard and Tasks (balanced / close to capacity / overloaded with totals, capacity, overload amount, task count), plus **Balance My Day** with a preview dialog (Apply / Cancel) that moves only flexible, incomplete, deadline-safe tasks.
- **Search**: global search dialog over tasks, goals, habits and events with categorized results that navigate to the right page.
- **Notifications**: bell opens a real panel driven by `notifications.ts` with read/unread persisted locally.
- **Settings**: profile fields controlled and persisted, capacity slider, theme kept working, unimplemented toggles disabled and labelled "Coming soon", real JSON export download, Reset demo behind a confirm dialog that fully resets state.
- **Copy honesty**: landing/FAQ drag-drop and "Never miss deadlines" claims rewritten; "Google Calendar sync" marked as roadmap; Google button on `/auth` labelled "Google sign-in — coming soon" and disabled, with a clear Demo Mode entry.
- **Cross-cutting**: empty states everywhere, loading states on all async actions, double-submit guards, form validation, `aria-label`s on icon-only buttons, dialog titles, no horizontal overflow on mobile.

## Verification
Walk the full 20-step demo flow in a headless browser at desktop and mobile viewports, check every route including refresh, then run lint and build and fix anything introduced.
