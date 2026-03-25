# Command & Report Upgrade — Feature Spec

## Overview

Backend migrated commands from immediate execution to a 2-step preview→confirm flow, with command sessions and report presets with generation.

## Architecture

### Command Domain (`domain/command/`)

**Types** (`models/command.types.ts`):
- `CommandSessionStatus`: `'pending' | 'confirmed' | 'rejected' | 'failed'`
- `CommandActionType`: `'task.create' | 'task.update' | 'task.assign' | 'task.status' | 'task.delete' | 'calendar_event.create' | 'calendar_event.update' | 'calendar_event.delete' | 'message.send'`
- `CommandAction`: `{ type: CommandActionType, payload: CommandActionPayload }`
- Typed payload interfaces: `TaskCreatePayload`, `TaskUpdatePayload`, `TaskAssignPayload`, `TaskStatusPayload`, `TaskDeletePayload`, `CalendarEventCreatePayload`, `CalendarEventUpdatePayload`, `CalendarEventDeletePayload`, `MessageSendPayload`
- `CommandRequest`: `{ text }`
- `CommandRejectRequest`: `{ feedback? }`
- `CommandPreviewResponse`: `{ session_id, actions, human_response, status: 'pending' }`
- `CommandConfirmResponse`: `{ actions_executed, human_response }`
- `CommandSession`: BaseEntity + raw_input, actions, human_response, status, feedback?, created_at

**API** (`api/command.api.ts`):
- `postCommand(workspaceId, data)` → `POST /workspaces/{id}/command` → returns preview
- `confirmCommandSession(workspaceId, sessionId)` → `POST .../sessions/{sid}/confirm`
- `rejectCommandSession(workspaceId, sessionId, data?)` → `POST .../sessions/{sid}/reject` → returns new preview
- `getCommandSessions(workspaceId, params?, signal?)` → `GET .../command/sessions`
- `getCommandSession(workspaceId, sessionId, signal?)` → `GET .../command/sessions/{sid}`
- `deleteCommandSession(workspaceId, sessionId)` → `DELETE .../command/sessions/{sid}`

**Constants** (`constants/command.constants.ts`): SESSION_STATUS_LABELS, SESSION_STATUS_TAG, SESSION_STATUS_OPTIONS, ACTION_TYPE_LABELS, ACTION_TYPE_TAG

### Report Domain (`domain/report/`)

**Types** (`models/report.types.ts`):
- `ReportPreset`: BaseEntity + title, description, prompt, workspace_id, timestamps
- `ReportPresetCreate`: `{ title, description, prompt }`
- `ReportGenerateRequest`: `{ preset_id, additional_query? }`
- `ReportGenerateResponse`: `{ markdown }`

**API** (`api/report-preset.api.ts`):
- `getReportPresets`, `getReportPreset`, `createReportPreset`, `updateReportPreset`, `deleteReportPreset`, `seedReportPresets`

**API** (`api/report.api.ts`):
- `generateReport(workspaceId, data)` → `POST .../reports/generate`

## Command Flow (Preview→Confirm)

### State Machine

Chat uses a union message type: `UserMessage | SystemMessage | PreviewMessage`.

PreviewMessage has status: `'pending' | 'confirming' | 'rejecting' | 'confirmed' | 'rejected'`

1. User sends text → push UserMessage → `postCommand()` → push PreviewMessage (pending)
2. User confirms → status='confirming' → `confirmCommandSession()` → status='confirmed' + push SystemMessage
3. User rejects → show feedback textarea → `rejectCommandSession()` → status='rejected' + push new PreviewMessage (pending)

Input is disabled while any preview is in an active state (pending/confirming/rejecting).

### Composables

- `useCommandsChat(workspaceId)` — messages, command text, send/confirm/reject logic
- `useCommandSessions(workspaceId)` — sessions list, select, new session
- `useCommandSessionDetail(workspaceId)` — loads single session as ChatMessage[]

### Components

- `CommandPreview.vue` — renders preview message with typed action labels (via ACTION_TYPE_LABELS/ACTION_TYPE_TAG), payload details (title, priority, time, location, channel, etc.), confirm/reject buttons, feedback input, status indicator
- `CommandSessionsList.vue` — left panel with session list, new session button, delete

### Page Layout

Commands page is split: sessions panel (280px left) + chat area (flex right).

## Report Presets CRUD

**Route**: `/workspaces/{id}/reports/presets`

- List page: CardsView with preset cards, auto-seed on first visit if empty
- Form page (`/presets/[presetId]`): title (required), description (textarea), prompt (required, textarea)
- Delete via DeleteConfirmationDialog

**Composables**: `usePresetsData`, `usePresetForm` (follows useTaskForm pattern)

## Report Generation

**Route**: `/workspaces/{id}/reports`

- Shows preset cards in a grid, each with textarea for additional query
- "Сгенерировать" button per card → calls `generateReport()` → renders Markdown via `marked` library
- Link to manage presets: "Управление пресетами"

## Action Types Reference

### Task Actions
| Type | Description | Key Payload Fields |
|------|-------------|-------------------|
| `task.create` | Create a new task | title (required), description, assignee_id, priority, deadline |
| `task.update` | Update task fields | task_id (required), title, description, assignee_id, priority, status, deadline |
| `task.assign` | Assign task to member | task_id (required), assignee_id (required) |
| `task.status` | Change task status | task_id (required), status (required) |
| `task.delete` | Delete a task | task_id (required) |

### Calendar Event Actions
| Type | Description | Key Payload Fields |
|------|-------------|-------------------|
| `calendar_event.create` | Create calendar event | title (required), start_time (required), end_time (required), description, location |
| `calendar_event.update` | Update event fields | event_id (required), title, description, start_time, end_time, location |
| `calendar_event.delete` | Delete calendar event | event_id (required) |

### Message Actions
| Type | Description | Key Payload Fields |
|------|-------------|-------------------|
| `message.send` | Send message to channel | text (required), channel_name (optional, defaults to general) |

### Multi-Action Commands
Commands can produce multiple actions in a single batch:
- Task creation with notification: `task.create` + `message.send`
- Meeting with preparation task: `calendar_event.create` + `task.create`
- Batch task creation: multiple `task.create` actions

### List/Query Commands (no actions)
These return empty `actions` array with data in `human_response`:
- List tasks: `список задач`, `мои задачи`, `покажи задачи`
- List events: `список событий`, `покажи события`, `календарь`
- List members: `список участников`, `кто в команде`, `команда`
- Help: `помощь`, `что ты умеешь`, `список команд`

## Deleted Files

- `domain/workspace/api/workspace-command.api.ts` — replaced by `domain/command/api/command.api.ts`
