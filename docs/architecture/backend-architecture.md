# Backend Architecture

## Purpose

The CiteSniff backend provides the HTTP boundary between the React client and the application logic responsible for source processing, evidence retrieval, evidence verification, and citation generation.

The backend is built with Node.js, Express, and TypeScript.

The architecture is intentionally kept small at the current stage. New layers and directories will be introduced when the application requires them rather than creating empty abstractions in advance.

The architecture is intentionally kept small for now. Instead of creating empty folders ahead of time, layers and directories will be added only when the app actually needs them.

## Current Structure

```text
server/
├── src/
│   ├── app.ts
│   └── server.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Application Entry Point

**src/app.ts** creates and configures the Express application.

```text
app.ts
    │
    ├── Create Express application
    ├── Register routes
    └── Export application
```

The application is exported without starting an HTTP server.

This separation allows the Express application to be imported independently for testing and future integration with other backend components.

## Server Entry Point

**src/server.ts** is responsible for starting the HTTP server.

```text
server.ts
    │
    ├── Import Express application
    ├── Define server configuration
    └── Start HTTP listener
```

The HTTP listener is intentionally kept outside **app.ts**.

This creates a clear distinction between the Express application itself and the process that assigns it to a network port.

## Current Request Flow

The current backend exposes a health-check endpoint:

```text
HTTP GET /health
        ↓
     Express
        ↓
      app.ts
        ↓
    JSON response
        ↓
{ "status": "ok" }
```

The endpoint provides a minimal runtime check that confirms the Express application can start and respond to HTTP requests.

## Separation of Responsibilities

The backend follows a separation-of-responsibilities principle.

### HTTP Layer

The HTTP layer is responsible for:

Receiving HTTP requests.
Routing requests.
Validating HTTP-specific input.
Formatting HTTP responses.
Handling HTTP-level errors.

It should not contain complex business logic.

### Application Layer

Application services will coordinate business operations such as:

Source processing.
Evidence retrieval.
Evidence verification.
Citation generation.
Reference generation.

These services will be introduced when the corresponding functionality is implemented.

### Domain Logic

Domain logic represents rules that are central to CiteSniff's behavior.

Examples include:

Evidence verification.
Quote length validation.
Source traceability rules.
Reliability constraints.

Domain logic should remain independently testable and should not depend directly on Express.

### Data Layer

The data layer will eventually be responsible for:

PostgreSQL persistence.
Source metadata.
Document information.
Evidence records.
Vector search through pgvector.

The data layer has not yet been implemented.

## Current Architecture Boundary

The current implementation establishes the following boundary:

```text
React Client
     │
     │ HTTP
     ▼
Express Application
     │
     ▼
Future Application Services
     │
     ▼
Future Domain and Data Layers
```

Only the first two backend levels currently exist in code.

The remaining layers are architectural direction rather than implemented functionality.

## Long-Running Processing

Source processing may become computationally expensive, particularly for large PDF documents and embedding generation.

The Express request lifecycle should not become responsible for long-running processing operations.

As the application evolves, asynchronous processing may be introduced when the implementation requirements justify it.

This decision is consistent with the project's broader architectural principle of separating HTTP handling from application processing.

## Testing Strategy

The Express application should remain independently importable so that HTTP-level tests can exercise the application without requiring the server process to bind to a network port.

Business rules should be tested independently from Express whenever possible.

The current backend has been validated at runtime through the **/health** endpoint.

## Current Status

Implemented:

Node.js backend application.
Express HTTP layer.
TypeScript configuration.
ESM module configuration.
Development execution with **tsx**.
Separate application and server entry points.
**GET /health** runtime check.

Not yet implemented:

Controllers.
Application services.
Domain modules on the backend.
Repositories.
PostgreSQL integration.
pgvector integration.
Source processing.
Evidence retrieval.
Authentication.

The architecture will evolve incrementally as these responsibilities become necessary.
