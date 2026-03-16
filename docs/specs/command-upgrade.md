# Command & Report Upgrade — Feature Spec

## Overview

Backend migrated commands from immediate execution to a 2-step preview→confirm flow, with command sessions and report presets with generation.

## Architecture

### Command Domain (`domain/command/`)

**Types** (`models/command.types.ts`):
- `CommandSessionStatus`: `'pending' | 'confirmed' | 'rejected'`
- `CommandAction`: `{ type, payload }`
- `CommandRequest`: `{ text }`
- `CommandRejectRequest`: `{ feedback? }`
- `CommandPreviewResponse`: `{ session_id, actions, human_response, status: 'pending' }`
- `CommandConfirmResponse`: `{ actions_executed, human_response, status: 'confirmed' }`
- `CommandSession`: BaseEntity + command_text, actions, human_response, status, timestamps

**API** (`api/command.api.ts`):
- `postCommand(workspaceId, data)` → `POST /workspaces/{id}/command` → returns preview
- `confirmCommandSession(workspaceId, sessionId)` → `POST .../sessions/{sid}/confirm`
- `rejectCommandSession(workspaceId, sessionId, data?)` → `POST .../sessions/{sid}/reject` → returns new preview
- `getCommandSessions(workspaceId, params?, signal?)` → `GET .../command/sessions`
- `getCommandSession(workspaceId, sessionId, signal?)` → `GET .../command/sessions/{sid}`
- `deleteCommandSession(workspaceId, sessionId)` → `DELETE .../command/sessions/{sid}`

**Constants** (`constants/command.constants.ts`): SESSION_STATUS_LABELS, SESSION_STATUS_TAG, SESSION_STATUS_OPTIONS

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

- `CommandPreview.vue` — renders preview message with actions tags, confirm/reject buttons, feedback input, status indicator
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

## Deleted Files

- `domain/workspace/api/workspace-command.api.ts` — replaced by `domain/command/api/command.api.ts`
