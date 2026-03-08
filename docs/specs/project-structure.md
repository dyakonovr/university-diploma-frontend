# Secretary App — Project Structure & Conventions

Reference: `news_service/` directory (same stack, same patterns).

## Stack
- **Go** — language
- **Chi v5** — HTTP router
- **Swag** — Swagger/OpenAPI generation (`swaggo/swag`, `swaggo/http-swagger`)
- **Goose v3** — migrations (`pressly/goose/v3`)
- **sqlc** — SQL → Go codegen (`pgx/v5` backend)
- **pgx/v5** — PostgreSQL driver + pool

---

## Full Target Structure

```
.
├── Dockerfile
├── Makefile
├── air.toml
├── sqlc.yaml
├── docker-compose.yaml
│
├── cmd/
│   └── secretary-app/
│       └── main.go              # entrypoint + swag root annotations + full wiring
│
├── configs/
│   └── main.yml                 # optional; config reads from ENV (see pattern below)
│
├── docs/                        # swag generated — do not edit
│   ├── docs.go
│   ├── swagger.json
│   ├── swagger.yaml
│   └── specs/                   # human-written specs
│
├── migrations/
│   ├── 20260304000000_init.sql                       # users, workspaces, memberships
│   ├── 20260304000001_tasks.sql
│   ├── 20260304000002_ai_context.sql
│   ├── 20260304000003_integrations.sql
│   ├── 20260308000001_drop_refresh_tokens.sql        # JWT refresh tokens are now stateless
│   └── 20260308000002_soft_delete_and_member_fk.sql  # soft delete + member FKs + api_token
│
├── internal/
│   ├── config/
│   │   └── config.go            # reads from ENV via os.Getenv
│   │
│   ├── domain/                  # pure business types — no DB or HTTP deps
│   │   ├── user.go              # struct + constructor + Validator
│   │   ├── workspace.go
│   │   ├── task.go
│   │   ├── ai_context.go
│   │   └── integration.go
│   │
│   ├── http/
│   │   ├── router.go            # chi router, mount routes, swagger, health
│   │   ├── middleware/
│   │   │   ├── auth.go          # JWT validation, inject userID into ctx
│   │   │   ├── role.go          # RequireRole: injects workspaceRole + memberID into ctx
│   │   │   └── cors.go
│   │   ├── handlers/
│   │   │   ├── auth.go
│   │   │   ├── workspace.go
│   │   │   ├── task.go
│   │   │   ├── ai_context.go
│   │   │   ├── command.go       # NL command engine endpoint
│   │   │   ├── employee.go
│   │   │   ├── integration.go
│   │   │   └── report.go
│   │   ├── dto/
│   │   │   ├── auth.go          # request/response structs + Validate()
│   │   │   ├── workspace.go
│   │   │   ├── task.go          # includes NewsFilters-style Parse(r) for list endpoints
│   │   │   ├── command.go
│   │   │   └── pagination.go    # shared PaginationRequest with Parse(r)
│   │   └── httputils/
│   │       └── respond.go       # Success(), Error(), Unprocessable(), Paginated() helpers
│   │
│   ├── infrastructure/
│   │   ├── deepseek/
│   │   │   ├── service.go       # implements service.AIProvider
│   │   │   └── models.go
│   │   └── telegram/
│   │       └── service.go       # implements service.BotNotifier
│   │
│   ├── service/
│   │   ├── ai_provider.go       # AIProvider interface
│   │   ├── bot_notifier.go      # BotNotifier interface
│   │   ├── auth.go
│   │   ├── workspace.go
│   │   ├── task.go
│   │   ├── ai_context.go
│   │   ├── command.go           # NL engine: text → AI → action dispatch
│   │   ├── integration.go
│   │   ├── report.go
│   │   └── jwt/
│   │       ├── service.go
│   │       └── models.go
│   │
│   ├── storage/
│   │   └── postgres/
│   │       ├── queries/         # raw SQL for sqlc — one file per domain
│   │       │   ├── users.sql
│   │       │   ├── workspaces.sql
│   │       │   ├── tasks.sql
│   │       │   ├── ai_context.sql
│   │       │   └── integrations.sql
│   │       ├── db.go            # sqlc generated
│   │       ├── models.go        # sqlc generated
│   │       ├── users.sql.go     # sqlc generated
│   │       ├── workspaces.sql.go
│   │       ├── tasks.sql.go
│   │       ├── ai_context.sql.go
│   │       └── integrations.sql.go
│   │
│   └── server/
│       └── server.go            # http.Server wrapper: Run(), Stop()
│
└── pkg/
    ├── logger/
    │   └── logger.go
    ├── modelValidation/
    │   ├── errors.go
    │   └── types.go
    └── utils/
        └── contains.go
```

---

## File Patterns (from news_service)

### `internal/config/config.go`
Reads from ENV directly — no viper, no YAML parsing.

```go
type Config struct {
    PostgresHost string
    Port         string
    JWTSecret    string
    // ...
}

func Load() *Config {
    return &Config{
        PostgresHost: getEnv("POSTGRES_HOST", "localhost"),
        Port:         getEnv("PORT", "8000"),
    }
}

func getEnv(key, defaultValue string) string {
    if v := os.Getenv(key); v != "" { return v }
    return defaultValue
}

func (c *Config) DatabaseURL() string {
    return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s", ...)
}
```

### `cmd/secretary-app/main.go`
Flat wiring — no separate `app.go` needed. Contains swag root comment.

```go
// @title Secretary App API
// @version 1.0
// @host localhost:8000
// @BasePath /api/v1
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {
    godotenv.Load()
    cfg := config.Load()

    pool, _ := pgxpool.New(ctx, cfg.DatabaseURL())
    defer pool.Close()

    // run goose migrations programmatically or via Makefile
    queries := postgres.New(pool)

    authService    := service.NewAuthService(queries, jwtService)
    taskService    := service.NewTaskService(queries)
    // ...

    authHandler    := handlers.NewAuthHandler(authService)
    taskHandler    := handlers.NewTaskHandler(taskService)
    // ...

    router := httphandlers.NewRouter(authHandler, taskHandler, ...)

    // graceful shutdown (existing server.go pattern)
}
```

### `internal/domain/task.go`
Plain struct + constructor + Validator (no DB types).

```go
type Task struct {
    ID          string
    WorkspaceID string
    AssigneeID  *string
    Title       string
    Priority    string    // "low" | "medium" | "high" | "critical"
    Status      string    // "backlog" | "in_progress" | "review" | "done" | "cancelled"
    Deadline    *time.Time
    CreatedAt   time.Time
    UpdatedAt   time.Time
}

func NewTask(workspaceID, title, priority string) *Task {
    return &Task{
        WorkspaceID: workspaceID,
        Title:       title,
        Priority:    priority,
        Status:      "backlog",
        CreatedAt:   time.Now(),
        UpdatedAt:   time.Now(),
    }
}

type TaskValidator struct{}

func (v TaskValidator) ValidateTitle(title string) error {
    if len(title) < 1 || len(title) > 255 {
        return errors.New("title length must be between 1 and 255")
    }
    return nil
}
```

### `internal/http/dto/task.go`
Request/response structs. Validate() returns ValidationErrors. Parse(r) for query filters.

```go
type CreateTaskRequest struct {
    Title    string  `json:"title"`
    Priority string  `json:"priority"`
    // ...
}

func (r CreateTaskRequest) Validate() modelvalidation.ValidationErrors {
    v := domain.TaskValidator{}
    errs := modelvalidation.ValidationErrors{}
    if err := v.ValidateTitle(r.Title); err != nil {
        errs.Add("title", err.Error())
    }
    return errs
}

type TaskFilters struct {
    Status   *string
    Assignee *string
}

func (f *TaskFilters) Parse(r *http.Request) {
    q := r.URL.Query()
    if v := q.Get("status"); v != "" { f.Status = &v }
}
```

### `internal/http/handlers/task.go`
Handler struct, swag annotations, httputils for responses.

```go
type TaskHandler struct{ service *service.TaskService }

func NewTaskHandler(s *service.TaskService) *TaskHandler { return &TaskHandler{service: s} }

// CreateTask godoc
// @Summary Create a task
// @Tags tasks
// @Accept json
// @Produce json
// @Param task body dto.CreateTaskRequest true "Task data"
// @Success 201 {object} httputils.SuccessResponse{data=dto.TaskResponse}
// @Failure 400 {object} httputils.ErrorResponse
// @Router /workspaces/{workspaceId}/tasks [post]
func (h *TaskHandler) CreateTask(w http.ResponseWriter, r *http.Request) {
    var req dto.CreateTaskRequest
    json.NewDecoder(r.Body).Decode(&req)

    if errs := req.Validate(); len(errs) != 0 {
        httputils.Error(w, r, "Validation error", http.StatusUnprocessableEntity, errs)
        return
    }

    model := domain.NewTask(workspaceID, req.Title, req.Priority)
    h.service.CreateTask(r.Context(), model)
    httputils.Success(w, r, dto.TaskResponse{...}, http.StatusCreated)
}
```

### `internal/http/router.go`

```go
func NewRouter(taskHandler *handlers.TaskHandler, ..., validator jwt.Validator) http.Handler {
    r := chi.NewRouter()
    r.Use(middleware.Logger, middleware.CORS)

    r.Get("/health", func(w http.ResponseWriter, r *http.Request) { w.Write([]byte("OK")) })
    r.Get("/swagger/*", httpSwagger.WrapHandler)

    r.Route("/api/v1", func(r chi.Router) {
        r.Route("/auth", func(r chi.Router) { ... })

        r.Group(func(r chi.Router) {
            r.Use(authMiddleware.RequireAuth(validator))
            r.Route("/workspaces/{workspaceId}/tasks", func(r chi.Router) {
                r.Get("/", taskHandler.ListTasks)
                r.Post("/", taskHandler.CreateTask)
                r.Get("/{id}", taskHandler.GetTask)
                r.Patch("/{id}", taskHandler.UpdateTask)
                r.Delete("/{id}", taskHandler.DeleteTask)
            })
        })
    })

    return r
}
```

### `internal/service/task.go`
Takes `*postgres.Queries` directly. Maps pgtype ↔ domain.

```go
type TaskService struct{ queries *postgres.Queries }

func NewTaskService(q *postgres.Queries) *TaskService { return &TaskService{queries: q} }

func (s *TaskService) CreateTask(ctx context.Context, task *domain.Task) error {
    var workspaceID pgtype.UUID
    workspaceID.Scan(task.WorkspaceID)

    created, err := s.queries.CreateTask(ctx, postgres.CreateTaskParams{
        WorkspaceID: workspaceID,
        Title:       task.Title,
        Priority:    task.Priority,
    })
    task.ID = created.ID.String()
    return err
}
```

### `internal/storage/postgres/queries/tasks.sql`

```sql
-- name: CreateTask :one
INSERT INTO tasks (workspace_id, title, priority, status)
VALUES ($1, $2, $3, 'backlog')
RETURNING *;

-- name: GetTask :one
SELECT * FROM tasks WHERE id = $1;

-- name: ListTasks :many
SELECT * FROM tasks
WHERE workspace_id = $1
  AND (sqlc.narg('status')::text IS NULL OR status = sqlc.narg('status'))
ORDER BY created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: UpdateTask :exec
UPDATE tasks SET title = $2, priority = $3, updated_at = NOW() WHERE id = $1;

-- name: DeleteTask :one
DELETE FROM tasks WHERE id = $1 RETURNING id;
```

### `migrations/YYYYMMDDHHMMSS_name.sql`

```sql
-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS users;
-- +goose StatementEnd
```

### `sqlc.yaml`

```yaml
version: "2"
sql:
  - engine: "postgresql"
    queries:
      - "internal/storage/postgres/queries/users.sql"
      - "internal/storage/postgres/queries/workspaces.sql"
      - "internal/storage/postgres/queries/tasks.sql"
      - "internal/storage/postgres/queries/ai_context.sql"
      - "internal/storage/postgres/queries/integrations.sql"
    schema: "migrations"
    gen:
      go:
        package: "postgres"
        out: "internal/storage/postgres"
        sql_package: "pgx/v5"
        emit_json_tags: true
        emit_interface: true
        emit_empty_slices: true
```

### `Makefile`

```makefile
generate_sqlc:
	sqlc generate

swagger:
	~/go/bin/swag init -g cmd/secretary-app/main.go -o docs --parseDependency --parseDepth 1

migrate:
	docker exec secretary_app goose -dir ./migrations postgres "$(DATABASE_URL)" up

up:
	docker-compose up -d --build
	@sleep 5

create: up migrate

dev:
	docker-compose up --build
```

### `air.toml`
Change only the build cmd and binary name:

```toml
[build]
  cmd = "go build -o ./tmp/main ./cmd/secretary-app"
  bin = "./tmp/main"
```

### `docker-compose.yaml`

```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: secretary_postgres
    env_file: .env
    ports:
      - "${POSTGRES_EXTERNAL_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks: [secretary_network]

  app:
    build: .
    container_name: secretary_app
    depends_on:
      postgres:
        condition: service_healthy
    env_file: .env
    expose: ["8000"]
    restart: unless-stopped
    networks: [secretary_network]

volumes:
  postgres_data:

networks:
  secretary_network:
    driver: bridge
```

---

## What Is Already in the Repo

| File | Status | Note |
|------|--------|------|
| `cmd/secretary-app/main.go` | ✅ | needs rewrite to flat wiring pattern |
| `internal/app/app.go` | ⚠️ | can be removed — fold into main.go |
| `internal/config/config.go` | ⚠️ | currently uses viper/YAML; switch to ENV pattern |
| `internal/server/server.go` | ✅ | keep |
| `internal/service/deepseek/` | ✅ | keep |
| `internal/service/jwt/` | ✅ | keep |
| `internal/service/telegram-bot/` | ✅ | keep |
| `pkg/logger/`, `pkg/modelValidation/`, `pkg/utils/` | ✅ | keep |
| `internal/api/` (old structure) | ❌ | replace with `internal/http/` layout |
| `internal/http/httputils/` | ❌ | create (replaces common/httputils) |
| Domain models | ❌ | create |
| Business services | ❌ | create |
| Migrations | ❌ | create |
| sqlc queries + generated code | ❌ | create |
| `sqlc.yaml` | ❌ | create |
| `Makefile` | ❌ | create |
| `docker-compose.yaml` | ❌ | create |
| `air.toml` | ❌ | create |
| `Dockerfile` | ❌ | create |
