1. Why i can't edit, delete comment in task? — BACKEND ISSUE: no DELETE/PUT routes for comments in router.go. Frontend delete button exists but backend endpoint is missing.
2. Where is task progress? — DONE (was already implemented in form)
3. Fix command session, if we doesn't have actions — DONE: empty actions now show human_response as system message
4. user can't approve failed command — DONE: added 'failed' status, retry button in CommandPreview
5. New session button doesn't work — DONE: now clears chat messages
6. In task show "last_synced_at" — DONE: moved to integration page (last_synced_at + token_expires_at)
7. We need to assignee member to task — DONE: added assignee select to task form

Also we have features list from backend:
```
## FRONTEND CHANGES NEEDED

### Task list/detail pages
- [x] Show `external_link` field — render as clickable link (icon + "Open in {source}") when present
- [x] Show `external_id` and `external_source` badges for synced tasks

### Calendar event list/detail pages
- [ ] Show `external_link` field — render as clickable link when present
- [ ] Show `external_id` and `external_source` for synced events

### Integration management page
- [x] Show `last_synced_at` — display "Last synced: {time}" for each integration
- [x] Show `token_expires_at` — display token expiry countdown or "Expired" badge
- [x] Add "Regenerate Token" button that calls `POST /integrations/{id}/regenerate-token`
- [x] After regeneration, show new `tokenExpiresAt` from response

### Command (NL) page
- [x] Handle `status: "failed"` — show retry button (call confirm again)
- [x] For commands with empty actions but human_response (like "список задач"), show the response text without confirm/reject buttons
- [ ] Update fallback "I didn't understand" message display (now includes command list)
```
You can check diff of backend, @/../university-diploma-backend
