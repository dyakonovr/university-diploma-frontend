I do task on backend and it's create tasks for frontend
```
Frontend tasks

  1. Command sessions page/panel — show list of sessions (GET /command/sessions), allow switching between them, viewing details, continuing
   pending ones (confirm/reject), and deleting old sessions
  2. Command flow — after entering text, show preview (actions + human response) with Confirm/Reject buttons. On reject with feedback,
  display the regenerated preview
  3. Report presets management (admin) — CRUD UI for presets: list, create (title + description + prompt), edit, delete. Call POST
  /reports/presets/seed on first visit to populate defaults
  4. Report generation page — show preset cards from GET /reports/presets, each with optional "additional query" text input, submit calls
  POST /reports/generate with preset_id + additional_query, render returned Markdown
  5. Update command endpoint — old POST /command that executed immediately is now a 2-step preview→confirm flow
```