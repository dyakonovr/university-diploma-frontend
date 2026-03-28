# Backend Upgrade: Admin Panel + Member Deduplication

> Backend branch: `start`
> Date: 2026-03-28

This document describes new backend APIs that need frontend implementation.

---

## 1. Super-Admin Panel

A system-level admin role has been added. Users with `is_admin = true` can manage all workspaces and users across the platform.

### Auth changes

- `GET /api/v1/auth/me` response now includes `"is_admin": bool`
- Blocked users receive `403` on login attempt (error: `"User is blocked"`)

### New endpoints

All admin endpoints require auth + `is_admin = true`. Non-admin users get `403`.

#### List all users
```
GET /api/v1/admin/users?page=1&per_page=20
```
Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "user@mail.com",
      "name": "John Doe",
      "is_admin": false,
      "blocked_at": null,
      "created_at": "2026-03-28T12:00:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "per_page": 20
}
```

#### List all workspaces
```
GET /api/v1/admin/workspaces?page=1&per_page=20
```
Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Workspace Name",
      "owner_id": "uuid",
      "owner_name": "John Doe",
      "owner_email": "john@mail.com",
      "member_count": 5,
      "created_at": "2026-03-28T12:00:00Z"
    }
  ],
  "total": 10,
  "page": 1,
  "per_page": 20
}
```

#### Block / Unblock user
```
POST /api/v1/admin/users/{userId}/block
POST /api/v1/admin/users/{userId}/unblock
```
Response: `{ "data": "ok" }`

#### Delete workspace (soft delete)
```
DELETE /api/v1/admin/workspaces/{workspaceId}
```
Response: `{ "data": "ok" }`

### Frontend TODO

- [ ] Add admin check: if `me.is_admin === true`, show "Admin Panel" link in sidebar/navbar
- [ ] Admin page: `/admin/users` — paginated table (email, name, is_admin badge, blocked status, created_at)
- [ ] Admin page: `/admin/workspaces` — paginated table (name, owner name+email, member count, created_at)
- [ ] Block/Unblock button on each user row (toggle based on `blocked_at`)
- [ ] Delete button on workspace row (with confirmation dialog)
- [ ] Handle `403` on login for blocked users — show "Your account has been blocked" message
- [ ] Test user: `admin@mail.com` / `admin123` (seeded with `is_admin = true`)

---

## 2. Member Deduplication — External Accounts View

One workspace member can have accounts in multiple external integrations (Redmine user #42, Mattermost @ivan, etc.). A new endpoint shows all linked accounts for a member.

### New endpoint

#### List external accounts for an employee
```
GET /api/v1/workspaces/{workspaceId}/employees/{userId}/external-accounts
```

Accessible by any workspace member (standard auth + workspace membership).

Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "integration_id": "uuid",
      "integration_name": "Redmine Production",
      "integration_type": "task_tracker",
      "external_user_id": "42",
      "external_username": "ivan",
      "created_at": "2026-03-28T12:00:00Z"
    },
    {
      "id": "uuid",
      "integration_id": "uuid",
      "integration_name": "Team Mattermost",
      "integration_type": "messenger",
      "external_user_id": "abc-def",
      "external_username": "@ivan.petrov",
      "created_at": "2026-03-28T12:00:00Z"
    }
  ]
}
```

### Backend improvements (no frontend action needed, but good to know)

- **Task sync now auto-resolves assignees**: when syncing tasks from Redmine/Yandex Tracker, the backend looks up `member_external_accounts` and sets `assignee_id` automatically. Previously, synced tasks always had `assignee_id = null`.
- **AI system prompt enriched**: the NL command engine now includes external account info in context, so the AI can correctly identify members across integrations (e.g., "assign to Ivan" resolves to the right member even when the command references a Redmine username).

### Frontend TODO

- [ ] Employee profile/detail page: add "External Accounts" section
- [ ] Show a list of linked accounts with integration name, type badge, and external username/ID
- [ ] Consider showing external accounts in employee list as small badges or tooltip
- [ ] After task sync, `assignee_id` may now be populated — verify that the assignee display works for synced tasks

---

## 3. Diploma Features (context)

These features are planned/implemented in the backend. See `docs/features/feature-plan.md` in the backend repo for full status.

### D1. Task Prioritization Based on Context (planned)
- New fields on tasks: `priority_score` (int), `priority_reason` (text)
- Sort by priority_score in task list
- "AI Prioritize" command support

### D2. Task Performance Evaluation (planned)
- `task_status_history` table tracking every status change
- `GET /reports/performance` endpoint
- Performance dashboard data

### Integration Source Display (planned)
- Task/event responses will include `integration_name`
- Task/event list will support `integration_id` filter
- Frontend: source badges on tasks/events, filter dropdown

---

## Summary of new API routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/admin/users` | admin | List all users (paginated) |
| POST | `/admin/users/{userId}/block` | admin | Block user |
| POST | `/admin/users/{userId}/unblock` | admin | Unblock user |
| GET | `/admin/workspaces` | admin | List all workspaces (paginated) |
| DELETE | `/admin/workspaces/{workspaceId}` | admin | Soft-delete workspace |
| GET | `/workspaces/{id}/employees/{userId}/external-accounts` | member | List member's external accounts |
