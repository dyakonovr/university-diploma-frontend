# Secretary App — User Flow

## 1. Context: Who Is the User?

In **80%+ of cases**, a business that adopts Secretary already has:

- A **CRM** for customer conversations (e.g., AmoCRM, Bitrix24, HubSpot)
- A **task tracker** for internal tasks (e.g., Jira, Trello, Asana, ClickUp)
- A **calendar** (Google Calendar, Outlook)

Secretary is **not a replacement** for these tools. It is an orchestration layer that sits on top of them — accepting natural language commands and dispatching actions into the user's existing ecosystem.

---

## 2. First-Time Setup Flow (Owner / Director)

### Step 1 — Register & Create Workspace
1. Owner opens the Secretary web app.
2. Registers with email + password.
3. Creates a **Workspace** (represents the company/team).

### Step 2 — Describe the Business (AI Context)
1. Owner opens the **AI Context** section in account settings.
2. Writes a free-form description of the business:
   - Company activity and priorities
   - Employee names, roles, skills, workload
   - Rules (e.g., "critical bugs are always assigned to Ivan")
   - Any relevant data the AI should know
3. Saves the context. From now on, all AI commands will use it.

### Step 3 — Connect External Services (Integrations)
1. Owner opens **Integrations** in workspace settings.
2. Creates a new integration:
   - Selects integration type: `task_tracker` / `crm` / `messenger`
   - Selects the system: Jira, Trello, custom, etc.
   - Provides credentials (API key, OAuth token, webhook URL)
3. On creation, Secretary automatically generates an `api_token` for outbound authentication. The token is visible in the response and can be regenerated at any time via the **Regenerate Token** action.
4. Clicks **Test connection** to verify.
5. Saves. Now Secretary can dispatch actions to this system.

> **First-phase alternative:** if the business does not yet have an external task tracker, Secretary's **native task module** is used instead. No external integration needed to start.

### Step 4 — Invite Team Members
1. Owner goes to **Members** in workspace settings.
2. Invites employees by email or shareable link.
3. Assigns each a role: `manager` or `employee`.
4. Employees receive an invite email and join the workspace.

---

## 3. Day-to-Day Flow: Director / Manager

The primary interaction is a **natural language command** issued from the web app or Telegram Bot.

### 3.1 Issuing a Command (Web App)
1. Manager opens the **Command** panel (chat-like interface) in the web app.
2. Types a request in plain language:
   > "Assign the payment integration bug to Denis, deadline is Thursday, priority high"
3. Secretary sends the text + business context to the AI.
4. AI returns a structured action batch.
5. Secretary executes the actions (creates a task in the connected tracker or native module).
6. The web app displays a confirmation:
   > "Done. Task 'Payment integration bug' assigned to Denis, due Thursday, high priority."

### 3.2 Issuing a Command (Telegram Bot)
1. Manager sends the same request to the workspace Telegram Bot.
2. Flow is identical — the bot is a thin interface over the same NL Command Engine.
3. Bot replies with the confirmation message.

### 3.3 Getting a Report
1. Manager types:
   > "Give me a summary of what the team did this week"
2. AI triggers `report.generate` action.
3. Secretary aggregates task data, completion rates, workload stats.
4. Returns an AI-written human-readable summary.

### 3.4 Viewing the Dashboard (Web App)
For structured data, the manager uses the **web app account pages**:

- **Tasks** — list of all tasks with filters (status, assignee, priority, deadline)
- **Employees** — workload overview, performance metrics per employee
- **Reports** — historical charts: task completion rate, workload distribution
- **Action Log** — audit trail of every AI-dispatched command

---

## 4. Day-to-Day Flow: Employee

Employees primarily interact via **Telegram Bot** (simpler, faster) but can also use the web app.

### 4.1 Receiving a Task
1. A task is created (by manager via command).
2. Secretary looks up the employee's linked Telegram account.
3. Bot sends a formatted notification:
   ```
   📌 New task assigned to you
   Title: Payment integration bug
   Priority: High
   Deadline: Thursday, March 6
   ```

### 4.2 Updating Task Status (Telegram)
Employee sends any of these:
```
done task 42
/status 42 in_progress
mark task 42 as review
```
Bot → NL Command Engine → `task.status` action → reply: "Task 42 marked as done."

### 4.3 Linking Telegram Account
1. Employee opens the web app → Profile → Telegram.
2. Gets a one-time link token.
3. Sends `/link <token>` to the Secretary Telegram Bot.
4. Account is linked. Notifications and commands now work via Telegram.

---

## 5. Integration Setup Flow (Custom Services via API Key)

> **Use case:** a business wants to connect their own internal system (custom CRM, proprietary ERP, internal dashboard) to Secretary.

### Step 1 — Generate an API Key
1. Owner/manager opens **Workspace Settings → API Access**.
2. Clicks "Generate API Key".
3. Copies the key (shown once; stored hashed).

### Step 2 — Register the Custom Integration
1. In **Integrations**, creates a new entry:
   - Type: `custom`
   - Provides the base URL of their internal service
   - Defines which action types this integration handles (`task.create`, `task.update`, etc.)
2. Secretary will forward matching actions to that URL as a webhook.

### Step 3 — Implement the Receiving Endpoint
The business's internal service receives a POST request from Secretary:
```json
{
  "action_type": "task.create",
  "payload": {
    "title": "Fix payment bug",
    "assignee": "denis",
    "priority": "high",
    "deadline": "2026-03-06"
  },
  "workspace_id": "ws_123",
  "timestamp": "2026-03-04T10:00:00Z"
}
```
The internal service processes it however it needs (creates a record in their own DB, calls their own CRM, etc.).

### Step 4 — Use Secretary as the Interface
From this point on, the business's team issues natural language commands to Secretary, and the actions flow automatically into their custom system. Secretary acts as the AI command translator.

---

## 6. Roles & Permission Summary

| Action | Owner | Manager | Employee |
|--------|-------|---------|----------|
| Create/edit AI Context | ✅ | ✅ | ❌ |
| Invite members | ✅ | ❌ | ❌ |
| Manage integrations | ✅ | ❌ | ❌ |
| Generate API keys | ✅ | ❌ | ❌ |
| Issue NL commands | ✅ | ✅ | ❌ |
| View reports/dashboard | ✅ | ✅ | ❌ |
| Receive task notifications | ✅ | ✅ | ✅ |
| Update own task status | ✅ | ✅ | ✅ |

---

## 7. Web App Structure (Account Pages)

The web app is the primary UI, structured around these sections:

| Section | Description |
|---------|-------------|
| **Dashboard** | Overview: open tasks, recent commands, team workload |
| **Commands** | Chat-like panel for NL command input and history |
| **Tasks** | Full task list with filters; create/edit tasks manually |
| **Employees** | Team members, workload, performance metrics |
| **Reports** | Charts and AI-generated summaries |
| **AI Context** | Edit the business context document |
| **Integrations** | Connect/manage external systems |
| **Settings** | Workspace config, API keys, member roles, Telegram bot setup |

---

## 8. Phased Rollout

### Phase 1 — Web App, Native Tasks (No External Integrations Required)
- Owner registers, writes AI context, invites team.
- Issues commands via web app → tasks created natively.
- Views task list, employee dashboard, basic reports.
- No external CRM/tracker needed.

### Phase 2 — Telegram Bot
- Employees link Telegram.
- Task notifications via bot.
- Status updates and manager commands via bot.

### Phase 3 — External Integrations
- Connect existing CRM / task tracker.
- AI commands now dispatch into the business's real tools.
- Custom service integration via API key + webhook.

### Phase 4 — Full Operation
- All flows active.
- Business uses Secretary as the single natural language interface over all their tools.
