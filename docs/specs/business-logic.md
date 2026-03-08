# Secretary App — Business Logic & Technical Specification

## 1. Overview

**Secretary** is an AI-powered management assistant for small businesses. It solves the problem of director/manager overload: when there is not enough time to monitor employee workload, track tasks, analyze performance, and control operations.

The application is built around two core ideas:
- **AI Business Context** — a free-form knowledge base about the business that makes the AI understand the company's specifics, priorities, employees, contractors, and rules.
- **Natural Language Interface** — the user speaks or types in plain language; the AI combines the request with the business context and produces a structured JSON action that the system executes.

Secretary is an **add-on layer**. It does not replace CRM systems, task trackers, or messengers — it connects to them via standardized API contracts and orchestrates actions across all of them.

---

## 2. Target Audience

| Role | Description |
|------|-------------|
| **Director** | Owner or top manager. Sets the AI context, reviews analytics, controls strategic tasks. |
| **Manager** | Middle management. Creates and delegates tasks, tracks team performance. |
| **Employee** | Receives tasks, updates statuses, interacts via Telegram Bot. |

---

## 3. Core Concepts

### 3.1 Business Context (AI Context)

A free-form text document stored per workspace that is always injected into AI prompts as a system message. It may contain:

- Company description and industry
- List of employees with roles, skills, and current workload
- Task priorities and deadlines
- Contractor and partner information
- Internal rules and policies
- Any other business-specific data

The context is managed by the director/manager via the web client. There is no strict schema — it is natural language or structured text.

**Goal:** make the AI model "aware" of the business so responses are relevant, not generic.

### 3.2 Natural Language Commands

The user sends a plain-language request (via web client or Telegram Bot). The system:

1. Takes the raw text input.
2. Combines it with the current Business Context.
3. Sends it to the AI model with a strict system prompt that demands a JSON response.
4. Parses the returned JSON into one or more **Actions**.
5. Executes each Action against the corresponding integration or internal module.

This means the user never needs to navigate menus or fill forms — everything is expressed in natural language.

**Example input:**
> "Assign the landing page task to Alexei with a deadline of Friday, mark it as high priority"

**AI output (JSON action):**
```json
{
  "actions": [
    {
      "type": "task.create",
      "payload": {
        "title": "Landing page",
        "assignee": "alexei",
        "deadline": "2026-03-06",
        "priority": "high"
      }
    }
  ]
}
```

### 3.3 API Contracts (Integration Layer)

Secretary does not own the data of external systems. Instead, it defines a set of **normalized action contracts** — a JSON schema for each supported action type.

When an action is triggered, the system looks up which integration is connected for that action type and translates the contract into the external API call.

Benefits:
- Swappable backends: connect Jira, Trello, Asana, or a custom system — the AI output stays the same.
- Multi-integration: multiple integrations can be registered and routed by action type.
- Decoupled: the AI layer and the UI layer never talk directly to external APIs.

---

## 4. Feature List

### 4.1 Workspace & Authentication
- Registration and login (JWT-based).
- Workspace — isolated environment per business/team.
- Roles: `owner`, `manager`, `employee`.
- Invite employees to a workspace by email or link.

### 4.2 Business Context Management
- CRUD for the AI Context document (free-form text).
- Version history — track context changes over time.
- Context is always passed as a system prompt to the AI.

### 4.3 Natural Language Command Processing
- Accept text input from web client and Telegram Bot.
- AI prompt construction: `system = business_context + action_schema_description`, `user = raw_input`.
- AI returns `ActionBatch` JSON.
- Parse, validate, and execute each action.
- Return human-readable confirmation to the user.

### 4.4 Task Management (Internal Module)
Even without external integrations, tasks can be managed natively:
- Create, update, delete tasks.
- Assign to employees.
- Set priority (`low`, `medium`, `high`, `critical`) and deadline.
- Status lifecycle: `backlog → in_progress → review → done → cancelled`.
- Comments on tasks.
- Filter and search.

### 4.5 Employee Management
- Employee profiles within a workspace.
- Skills and roles.
- Current workload score (derived from open tasks).
- Performance metrics (tasks completed, on-time rate).

### 4.6 Integration Management
- Register external integrations (CRM, task tracker, messenger).
- Each integration has: type, credentials (stored encrypted), a mapping of which action types it handles, and an `api_token`.
- `api_token` — generated automatically on creation; used by Secretary when calling out to the external service. Can be regenerated at any time via `POST /workspaces/:id/integrations/:integrationId/regenerate-token`.
- Supported integration types (initial list):
  - `task_tracker` — Jira, Trello, Linear, custom.
  - `crm` — custom CRM systems.
  - `messenger` — Telegram (built-in), Slack.

### 4.7 Reports & Analytics
- Employee performance dashboard.
- Task completion rate over time.
- Workload distribution across the team.
- AI-generated summary report on demand ("Give me a weekly team report").

### 4.8 Telegram Bot Interface
- Employees can receive task notifications via Telegram.
- Employees can update task status via Telegram commands or natural language.
- Directors/managers can issue natural language commands via Telegram.
- Bot is connected per workspace.

---

## 5. Architecture

### 5.1 High-Level Components

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│   Web App (SPA)              Telegram Bot                    │
└────────────────┬───────────────────────┬────────────────────┘
                 │                       │
                 ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      Secretary API (Go)                       │
│                                                              │
│  ┌───────────┐  ┌────────────┐  ┌──────────────────────┐   │
│  │   Auth    │  │  Context   │  │   NL Command Engine  │   │
│  │  Module   │  │  Module    │  │  (AI Orchestrator)   │   │
│  └───────────┘  └────────────┘  └──────────┬───────────┘   │
│                                             │               │
│  ┌───────────┐  ┌────────────┐             ▼               │
│  │   Task    │  │ Employee   │  ┌──────────────────────┐   │
│  │  Module   │  │  Module    │  │   Action Dispatcher  │   │
│  └───────────┘  └────────────┘  └──────────┬───────────┘   │
│                                             │               │
│  ┌──────────────────────────────────────────▼───────────┐  │
│  │             Integration Adapter Layer                  │  │
│  │   [Jira Adapter] [Trello Adapter] [Custom Adapter]   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│    External Systems: Jira / Trello / CRM / Slack / etc.      │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Technology Stack

| Component | Technology |
|-----------|-----------|
| Backend | Go |
| Database | PostgreSQL |
| AI Model | Deepseek (`deepseek-chat`) — accessed via `AIProvider` interface |
| Bot | Telegram Bot API — accessed via `BotNotifier` interface |
| Auth | JWT (access + refresh tokens, both stateless — no DB refresh token storage) |
| Config | YAML + ENV |
| HTTP Router | Chi v5 |

### 5.3 Database Schema (Conceptual)

**workspaces** — tenant isolation unit; has `deleted_at` for soft delete
**users** — global users, belong to workspaces via memberships
**memberships** — user ↔ workspace with role; has `deleted_at` for soft delete
**ai_contexts** — the business context document per workspace
**tasks** — native task records; has `deleted_at` for soft delete; `created_by` and `assignee_id` reference `memberships(id)`
**task_comments** — comments on tasks; `author_id` references `memberships(id)`
**integrations** — registered external integrations per workspace; has `deleted_at` for soft delete; has `api_token` (generated on creation, regeneratable)
**action_logs** — audit log of every AI-dispatched action; `member_id` references `memberships(id)` (not user directly)

Note: `refresh_tokens` table has been removed — refresh tokens are now stateless JWTs with `tokenType: "refresh"` claim.

---

## 6. Action Contract Specification

Every AI response follows this schema:

```json
{
  "actions": [
    {
      "type": "<module>.<verb>",
      "payload": { ... }
    }
  ],
  "human_response": "Done! Task assigned to Alexei with deadline Friday."
}
```

### 6.1 Supported Action Types

| Type | Description | Key Payload Fields |
|------|-------------|-------------------|
| `task.create` | Create a new task | `title`, `description`, `assignee_id`, `priority`, `deadline` |
| `task.update` | Update task fields | `task_id`, fields to change |
| `task.assign` | Change task assignee | `task_id`, `assignee_id` |
| `task.status` | Change task status | `task_id`, `status` |
| `task.delete` | Delete a task | `task_id` |
| `task.list` | Query tasks with filters | `assignee_id`, `status`, `priority`, `date_range` |
| `employee.list` | List employees | `workspace_id`, optional filters |
| `report.generate` | Generate a report | `report_type`, `date_range`, `scope` |
| `context.update` | Update the AI context | `content` (or a diff) |

New action types can be added as integrations are built.

### 6.2 AI System Prompt Template

```
You are a business management assistant for the company described below.
Your job is to convert the user's natural language request into a structured JSON action batch.
Always return valid JSON. Never include explanations outside the JSON.

--- BUSINESS CONTEXT ---
{business_context}
--- END CONTEXT ---

Available action types and their schemas:
{action_schema}

Response format:
{
  "actions": [ { "type": "...", "payload": { ... } } ],
  "human_response": "..."
}
```

---

## 7. API Endpoints (Draft)

### Auth
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

### Workspace
```
POST   /api/v1/workspaces
GET    /api/v1/workspaces/:id
PATCH  /api/v1/workspaces/:id
POST   /api/v1/workspaces/:id/invite
DELETE /api/v1/workspaces/:id/members/:userId
```

### AI Context
```
GET    /api/v1/workspaces/:id/context
PUT    /api/v1/workspaces/:id/context
GET    /api/v1/workspaces/:id/context/history
```

### Natural Language Command
```
POST /api/v1/workspaces/:id/command
Body: { "text": "..." }
Response: { "actions_executed": [...], "human_response": "..." }
```

### Tasks
```
GET    /api/v1/workspaces/:id/tasks
POST   /api/v1/workspaces/:id/tasks
GET    /api/v1/workspaces/:id/tasks/:taskId
PATCH  /api/v1/workspaces/:id/tasks/:taskId
DELETE /api/v1/workspaces/:id/tasks/:taskId
POST   /api/v1/workspaces/:id/tasks/:taskId/comments
```

### Employees
```
GET    /api/v1/workspaces/:id/employees
GET    /api/v1/workspaces/:id/employees/:userId
PATCH  /api/v1/workspaces/:id/employees/:userId
```

### Integrations
```
GET    /api/v1/workspaces/:id/integrations
POST   /api/v1/workspaces/:id/integrations
DELETE /api/v1/workspaces/:id/integrations/:integrationId
POST   /api/v1/workspaces/:id/integrations/:integrationId/test
POST   /api/v1/workspaces/:id/integrations/:integrationId/regenerate-token
```

### Reports
```
GET /api/v1/workspaces/:id/reports/performance
GET /api/v1/workspaces/:id/reports/workload
POST /api/v1/workspaces/:id/reports/generate
```

---

## 8. Telegram Bot Flows

### 8.1 Employee Task Notification
1. Task is created/assigned to an employee.
2. System looks up the employee's linked Telegram account.
3. Bot sends a formatted message with task details.

### 8.2 Status Update via Bot
Employee sends: `done task 42` or `/status 42 done`
Bot → NL Command Engine → `task.status` action → confirmation reply.

### 8.3 Manager Command via Bot
Manager sends any natural language command.
Bot → NL Command Engine → actions executed → human-readable reply.

### 8.4 Linking Telegram Account
Employee receives a one-time link token in the web app, sends `/link <token>` to the bot.

---

## 9. Key Design Decisions & Open Questions

| # | Topic | Decision / Options |
|---|-------|--------------------|
| 1 | Multi-tenancy | Workspace-based isolation at the application level |
| 2 | AI model | Deepseek (`deepseek-chat`) — swappable via `AIProvider` interface in `internal/infrastructure/deepseek/` |
| 3 | Context length | Must monitor token usage; truncate oldest context versions if needed |
| 4 | Action execution | Synchronous for now; async queue (e.g., Redis) for heavy integrations later |
| 5 | Integration auth | Each integration has an `api_token` (32-byte hex) generated on creation; regeneratable |
| 6 | Bot multi-workspace | One Telegram bot token can serve multiple workspaces (identified by chat linkage) |
| 7 | AI confidence | If AI returns low-confidence output, prompt user to confirm before executing |
| 8 | Action rollback | Phase 2 — store action logs to enable undo where the external API supports it |
| 9 | Soft delete | `workspaces`, `memberships`, `tasks`, `integrations` use `deleted_at TIMESTAMPTZ NULL`; all SELECTs filter `AND deleted_at IS NULL` |
| 10 | Member-centric design | Workspace-scoped actions (task create/assign, comments, command logs) use `membership.id` not `user.id`; `RequireRole` middleware injects `memberID` into context |
| 11 | JWT refresh tokens | Refresh tokens are stateless JWTs with `tokenType: "refresh"` claim (30-day expiry); no DB storage; logout is client-side only |

---

## 10. Implementation Phases

### Phase 1 — Core Foundation
- [ ] Auth module (register, login, JWT)
- [ ] Workspace + membership management
- [ ] AI Context CRUD
- [ ] Native Task module (full CRUD)
- [ ] NL Command Engine (text → AI → action dispatch)
- [ ] PostgreSQL schema and migrations

### Phase 2 — Telegram & Reporting
- [ ] Telegram Bot: account linking
- [ ] Telegram Bot: task notifications
- [ ] Telegram Bot: NL commands from Bot
- [ ] Employee workload & performance metrics
- [ ] Basic reports (performance, workload)

### Phase 3 — Integration Layer
- [ ] Integration registry (store, activate, deactivate)
- [ ] Integration adapter interface
- [ ] First external adapter (e.g., Trello or Jira)
- [ ] Action routing to external adapters

### Phase 4 — Polish
- [ ] Context version history
- [ ] AI confidence threshold + user confirmation flow
- [ ] Action audit log
- [ ] Async action queue for heavy operations
