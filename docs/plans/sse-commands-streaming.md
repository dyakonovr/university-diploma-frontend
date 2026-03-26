# Frontend Plan: SSE Streaming for Commands

## Context

The backend now has two new SSE endpoints for the command feature:
- `POST /api/v1/workspaces/{workspaceId}/command/stream` — Preview with real-time stage updates
- `POST /api/v1/workspaces/{workspaceId}/command/{sessionId}/confirm/stream` — Confirm with per-action progress

Currently the frontend waits with a spinner ("Обрабатывается...") until the entire operation completes. With SSE, users will see live progress: which stage the AI is at, and which actions are being executed one by one.

## Backend SSE Protocol

### Preview stream (`POST /command/stream`)

Request body: `{ "text": "..." }` (same as regular `/command`)

Events:
```
event: status
data: {"stage":"building_context"}

event: status
data: {"stage":"calling_ai"}

event: status
data: {"stage":"parsing_response"}

event: status
data: {"stage":"saving_session"}

event: result
data: {"session_id":"...","actions":[...],"human_response":"...","status":"pending"}

event: done
data:
```

On error:
```
event: error
data: {"message":"AI request failed"}
```

### Confirm stream (`POST /command/{sessionId}/confirm/stream`)

Events:
```
event: action_start
data: {"index":0,"total":3,"action":{"type":"task.create","payload":{...}}}

event: action_done
data: {"index":0,"total":3,"action":{"type":"task.create","payload":{...}},"success":true,"error":""}

event: result
data: {"actions_executed":[...],"human_response":"..."}

event: done
data:
```

**Important**: SSE sends HTTP 200 immediately. Errors arrive as `event: error`, not HTTP status codes.

---

## What Needs to Change

### 1. SSE Client Utility (NEW)

**File**: `app/shared/utils/core/sse.client.ts`

The standard `EventSource` API only supports GET. Since our endpoints use POST with JSON body, we need a custom SSE client using `fetch` with streaming response parsing.

```typescript
interface SSEClientOptions {
  url: string;
  body?: Record<string, unknown>;
  onEvent: (event: string, data: string) => void;
  onError?: (error: Error) => void;
  onDone?: () => void;
  signal?: AbortSignal;
}

function createSSEClient(options: SSEClientOptions): void
```

Implementation approach:
- Use `fetch()` with `method: 'POST'`, `credentials: 'include'` (for cookies), `Content-Type: application/json`
- Read `response.body` as `ReadableStream` via `getReader()`
- Parse the SSE text protocol: split by `\n\n`, extract `event:` and `data:` fields
- Call `onEvent(eventName, dataString)` for each parsed event
- Handle `event: done` by calling `onDone()`
- Handle `event: error` by calling `onError()`
- Support `AbortSignal` for cancellation

**Note**: Cannot reuse the existing `request.client.ts` because it uses `$fetch.raw()` which buffers the full response. We need raw `fetch()` for streaming.

### 2. Command Types Update

**File**: `app/domain/command/models/command.types.ts`

Add new types:

```typescript
// Preview SSE event types
type PreviewStage = 'building_context' | 'calling_ai' | 'parsing_response' | 'saving_session';

interface PreviewStatusEvent {
  stage: PreviewStage;
}

// Confirm SSE event types
interface ActionProgressEvent {
  index: number;
  total: number;
  action: CommandAction;
  done?: boolean;
  success?: boolean;
  error?: string;
}

// SSE error event
interface SSEErrorEvent {
  message: string;
}
```

### 3. Command API Update

**File**: `app/domain/command/api/command.api.ts`

Add two new streaming API functions:

```typescript
function postCommandStream(
  workspaceId: string,
  data: CommandRequest,
  callbacks: {
    onStatus: (stage: PreviewStage) => void;
    onResult: (preview: CommandPreviewResponse) => void;
    onError: (message: string) => void;
    onDone: () => void;
  },
  signal?: AbortSignal,
): void

function confirmCommandSessionStream(
  workspaceId: string,
  sessionId: string,
  callbacks: {
    onActionStart: (progress: ActionProgressEvent) => void;
    onActionDone: (progress: ActionProgressEvent) => void;
    onResult: (result: CommandConfirmResponse) => void;
    onError: (message: string) => void;
    onDone: () => void;
  },
  signal?: AbortSignal,
): void
```

Keep existing `postCommand()` and `confirmCommandSession()` as fallbacks.

### 4. Command Constants Update

**File**: `app/domain/command/constants/command.constants.ts`

Add stage labels for the streaming UI:

```typescript
const PREVIEW_STAGE_LABELS: Record<PreviewStage, string> = {
  building_context: 'Загрузка контекста...',
  calling_ai: 'ИИ обрабатывает запрос...',
  parsing_response: 'Анализ ответа...',
  saving_session: 'Сохранение...',
};
```

### 5. Chat Composable Update (main logic change)

**File**: `app/pages/.../commands/_composables/useCommandsChat.ts`

#### `sendCommand()` changes:

Current flow:
1. Add UserMessage
2. Add "Обрабатывается..." system message
3. `await postCommand()` (blocked until full response)
4. Replace system message with PreviewMessage

New flow with SSE:
1. Add UserMessage
2. Add StreamingMessage (new message type) — shows current stage label
3. Call `postCommandStream()` with callbacks:
   - `onStatus(stage)` → update StreamingMessage text to `PREVIEW_STAGE_LABELS[stage]`
   - `onResult(preview)` → replace StreamingMessage with PreviewMessage
   - `onError(msg)` → replace StreamingMessage with ErrorMessage
   - `onDone()` → mark streaming complete
4. Fallback: if SSE fails to connect (old backend), fall back to `postCommand()`

#### `confirmPreview()` changes:

Current flow:
1. Set status = 'confirming'
2. `await confirmCommandSession()` (blocked)
3. Update status + add SystemMessage with result

New flow with SSE:
1. Set status = 'confirming'
2. Add ProgressMessage showing action execution progress
3. Call `confirmCommandSessionStream()` with callbacks:
   - `onActionStart(p)` → update ProgressMessage: "Выполняется действие {p.index+1}/{p.total}: {actionLabel}"
   - `onActionDone(p)` → update progress with success/fail indicator
   - `onResult(result)` → finalize, update preview status to 'confirmed'
   - `onError(msg)` → show error toast, set status to 'failed'

### 6. New Message Types

**File**: `app/pages/.../commands/_composables/useCommandsChat.ts` (or extract to types)

Add new ChatMessage variants:

```typescript
// Existing:
type ChatMessage = UserMessage | SystemMessage | PreviewMessage;

// Add:
interface StreamingMessage {
  type: 'streaming';
  id: string;
  stageLabel: string;     // current stage text
  timestamp: Date;
}

interface ProgressMessage {
  type: 'progress';
  id: string;
  currentIndex: number;
  total: number;
  actions: Array<{
    action: CommandAction;
    status: 'pending' | 'running' | 'success' | 'failed';
    error?: string;
  }>;
  timestamp: Date;
}

type ChatMessage = UserMessage | SystemMessage | PreviewMessage | StreamingMessage | ProgressMessage;
```

### 7. New UI Components

#### StreamingIndicator (NEW)

**File**: `app/pages/.../commands/_components/StreamingIndicator.vue`

Renders the current streaming stage with an animated indicator:
- Animated dots or pulse animation
- Stage label text (from constants)
- Subtle, doesn't take much vertical space

#### ActionProgressList (NEW)

**File**: `app/pages/.../commands/_components/ActionProgressList.vue`

Renders action-by-action execution progress during confirm:
- List of actions with status icons: pending (gray), running (spinner), success (green check), failed (red x)
- Action type label + key detail (task title, event name, etc.)
- Shows error message for failed actions
- Animates as new events arrive

### 8. Commands Page Update

**File**: `app/pages/.../commands/index.vue`

Update the template to render new message types:
- `StreamingMessage` → render `<StreamingIndicator />`
- `ProgressMessage` → render `<ActionProgressList />`

---

## Implementation Order

1. **SSE client utility** (`sse.client.ts`) — core infrastructure, test independently
2. **Types** — add new types to `command.types.ts`
3. **Constants** — add stage labels
4. **API functions** — add `postCommandStream` and `confirmCommandSessionStream`
5. **Message types** — extend ChatMessage union
6. **UI components** — `StreamingIndicator.vue` and `ActionProgressList.vue`
7. **Composable** — update `useCommandsChat.ts` with SSE logic
8. **Page** — render new message types in template
9. **Fallback** — ensure graceful degradation if SSE not available

## Edge Cases to Handle

- **Client disconnects mid-stream**: AbortController should cancel the fetch
- **SSE connection fails**: Fall back to existing synchronous endpoints
- **Browser tab hidden**: Messages might pile up — batch UI updates
- **Multiple rapid commands**: Disable input while streaming (already done via `sending` ref)
- **Session refresh during SSE**: The `request.client.ts` 401 retry logic won't apply to raw fetch — handle 401 in SSE client by redirecting to login

## Files Summary

| Action | File |
|--------|------|
| CREATE | `app/shared/utils/core/sse.client.ts` |
| CREATE | `app/pages/.../commands/_components/StreamingIndicator.vue` |
| CREATE | `app/pages/.../commands/_components/ActionProgressList.vue` |
| UPDATE | `app/domain/command/models/command.types.ts` |
| UPDATE | `app/domain/command/constants/command.constants.ts` |
| UPDATE | `app/domain/command/api/command.api.ts` |
| UPDATE | `app/pages/.../commands/_composables/useCommandsChat.ts` |
| UPDATE | `app/pages/.../commands/index.vue` |
