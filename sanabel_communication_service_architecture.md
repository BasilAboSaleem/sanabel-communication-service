# Sanabel Communication Service – Backend Architecture

© 2025 – Sanabel Youth & Development Foundation

---

## 0. Architectural Context (Very Important)

Sanabel Communication Service **is NOT a standalone authentication system**.

This service is a **subsystem** that integrates with an **external / core system** responsible for:

- Authentication (Login / Identity)
- User source of truth
- JWT issuance or trusted identity headers

👉 **This service ONLY consumes trusted identity data** and focuses exclusively on:
- Internal communication
- Real-time messaging
- Message auditing & traceability

---

## 1. Core Principles

- **Single Tenant** (Sanabel only)
- **No Auth Logic** (no login / register)
- **Socket-first Architecture** (real-time is primary)
- **Audit-first Messaging System** (every critical action is traceable)
- Clean layered backend
- Production-grade from day one

---

## 2. High-Level System Responsibility

What this system DOES:
- Real-time conversations (1-1, groups)
- Message delivery
- Message lifecycle (create / edit / delete)
- Group management
- Presence & typing indicators
- Full audit trail for communication actions

What this system DOES NOT do:
- User authentication
- User registration
- Passwords or sessions
- Role management source

---

## 3. Identity & Auth Integration Model

### Identity Source
- External Core System (Trusted)
- This service receives:
  - userId
  - name
  - role
  - permissions (optional)

### Integration Methods (one of):
- JWT issued by core system
- Internal service token
- API Gateway injected headers

### Middleware Responsibility

```
Incoming Request / Socket Connection
   ↓
Identity Middleware
   - Validate token/signature
   - Extract user context
   - Attach req.user / socket.user
```

❌ No login controllers
❌ No auth service

---

## 4. Project Structure (Corrected & Complete)

```
sanabel-communication-service/
├── app/
|   ├── constants/           # Roles&Permissions                
│   ├── controllers/         # Request handlers
│   ├── services/            # Business logic
│   ├── repositories/        # DB operations abstraction
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routing
│   ├── middlewares/         # Auth, error handling, etc.
│   ├── validators/          # Input validation
│   └── sockets/             # WebSocket / SSE handlers
│
├── config/                  # DB, Redis, Queue, JWT, Cloudinary, Env
├── locales/                 # Multi-language support (i18n)
├── public/                  # Static files (images, uploads, etc.)
├── views/                   # Optional test pages or admin dashboard
├── workers/                 # Background job workers (BullMQ/Redis)
├── queues/                  # Queue definitions (purchaseQueue, notificationQueue)
├── logs/                    # Application logs
├── tests/                   # Unit and integration tests
├── .gitignore               # Standard ignore patterns
├── permissions.md           # Roles & Permissions guide
├── README.md                # Project documentation and overview
├── scenario.md              # Project scenarios / user flows
├── .env                     # Environment variables
├── app.js                   # Express setup only
└── server.js                # HTTP server + Socket.io + Workers initialization

```

---

## 5. Socket-First Design (Core of the System)

### Why Socket-first?
- Messaging is real-time by nature
- REST is secondary (history, metadata)

### Socket Responsibilities
- Send / receive messages
- Join / leave conversations
- Group events
- Presence & typing

```
Client
  ↔ Socket.io
      → Services
          → MongoDB
          → Redis Pub/Sub
```

---

## 6. Message Lifecycle (Audited)

Every message action creates an audit record:

| Action | Audited | Stored |
|------|--------|--------|
| Send message | ✅ | Message + Audit |
| Edit message | ✅ | Diff / Metadata |
| Delete message | ✅ | Soft delete |

---

## 7. Audit Log (Mandatory & Scoped)

Audit Logs are **MANDATORY** but **SCOPED ONLY to communication system**.

### Logged Actions
- Message sent / edited / deleted
- Group created / renamed / deleted
- User added / removed from group

### Audit Model (Conceptual)

```
AuditLog
- actorId
- action
- entityType (Message, Group)
- entityId
- metadata
- timestamp
```

Audit writes are async via queue to avoid socket latency.

---

## 8. Data Consistency Strategy

- Messages are immutable except edits
- Deletes are soft deletes
- Socket events are source of truth
- REST endpoints for:
  - History loading
  - Search

---

## 9. Deployment & Runtime

- Docker Compose
- MongoDB
- Redis (Pub/Sub + Queue)
- Node.js clustered if needed

---

## 10. System Context

```
External Core System (Auth / Identity)
        ↓  (JWT / Headers)
Frontend (Web / Internal Dashboard)
        ↓  (Socket + REST)
Nginx / API Gateway
        ↓
Sanabel Communication Service
  - Socket.io (Primary)
  - Express REST (Secondary)
        ↓
Service Layer
        ↓
MongoDB  ←→  Redis (Pub/Sub + Queues)
```

This service **trusts identity** provided by the core system and does not authenticate users itself.

---

## 11. Component Diagram (Internal Architecture)

```
Socket / REST Layer
        ↓
Controllers / Socket Handlers
        ↓
Services (Business Logic)
        ↓
Repositories (DB Access)
        ↓
MongoDB

Services
   ↓ (Async)
Redis Queue → Workers → MongoDB / Logs
```

Responsibilities are strictly separated:
- No DB access from sockets/controllers
- No socket logic inside services

---

## 12. Request Lifecycle Flow

### Socket Event Flow (Primary)

```
Client
  → Socket Event
    → Socket Auth Middleware
      → Socket Handler
        → Service
          → Repository
            → MongoDB
          → Emit Event
```

### REST Flow (Secondary)

```
HTTP Request
  → Identity Middleware
    → Controller
      → Service
        → Repository
          → MongoDB
      → Response
```

---

## 13. Async Flow / Background Jobs

Used mainly for **Audit Logs** and heavy tasks.

```
Service
  → Push Job (Redis Queue)
    → Worker
      → MongoDB (Audit Logs)
```

This ensures:
- No socket latency
- Guaranteed audit persistence

---

## 14. Database Schema Overview (ERD)

```
User (shadow)
  └── id

Conversation
  ├── id
  ├── type (direct / group)
  └── members[] → User

Message
  ├── id
  ├── conversationId → Conversation
  ├── senderId → User
  ├── content
  ├── editedAt
  └── deletedAt

AuditLog
  ├── actorId → User
  ├── action
  ├── entityType
  ├── entityId
  └── timestamp
```

All deletes are **soft deletes**.

---

## 15. Security & Auth Flow (Externalized Auth)

```
Client
  → Connect (JWT / Token)
    → Identity Middleware
      → Token Validation (public key / secret)
      → Attach user context
```

Security guarantees:
- No anonymous socket connections
- All actions linked to a verified user
- Permissions enforced per action

---

## 16. DevOps & Deployment

- Docker Compose
  - Node.js App
  - MongoDB
  - Redis
  - Nginx

- Environment-based config
- Ready for:
  - Horizontal scaling
  - Socket clustering
  - CI/CD pipelines

---

## 17. This Architecture Is Final

This document represents the **complete and correct architecture** for:

**Sanabel Communication Service**

Any implementation must strictly follow this design.

