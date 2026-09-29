# Keep Client and Server as Independent Applications

## Context

CiteSniff consists of two applications with different responsibilities:

-   A React frontend responsible for the user interface.
-   An Express backend responsible for API operations, document
    processing, evidence retrieval, and application services.

These applications require different dependencies, development tooling,
build processes, and runtime environments.

## Decision

The frontend and backend will remain independent applications within the
same Git repository.

The repository will not contain a root-level `package.json`.

Each application will maintain its own:

-   `package.json`
-   `package-lock.json`
-   dependencies
-   scripts
-   TypeScript configuration
-   development tooling
-   environment configuration

The structure is:

``` text
CiteSniff/
├── client/
│   ├── package.json
│   └── .env.example
│
├── server/
│   ├── package.json
│   └── .env.example
│
└── docs/
```

## Reason

The frontend and backend have different technical responsibilities and
dependency requirements, keeping them independent provides:

-   Clear responsibility boundaries.
-   Independent dependency management.
-   Independent build processes.
-   Independent runtime configuration.
-   Simpler local development.
-   Reduced coupling between frontend and backend tooling.

The repository still provides a single place for source control and
project documentation.

## Alternatives Considered

### Root-level package.json with workspaces

A workspace-based monorepo was considered.

It was rejected for the initial project because the frontend and backend
do not currently require shared packages or shared source code.

Introducing workspace infrastructure at this stage would add complexity
without solving an immediate problem.

### Separate Git repositories

Separate repositories were also considered.

This was rejected because CiteSniff is currently a single product whose
frontend and backend evolve together.

Keeping both applications in one repository provides simpler project
visibility and makes the development history easier to understand.

## Consequences

### Positive

-   Clear application boundaries.
-   Independent dependencies.
-   Independent scripts.
-   Easier troubleshooting.
-   No unnecessary root-level Node.js configuration.

### Negative

-   Some tooling configuration is intentionally duplicated.
-   Shared types or utilities will require an explicit architectural
    decision if they become necessary.

## Follow-up

If the application later requires shared TypeScript types or reusable
packages between client and server, I will evaluate introducing a
dedicated shared package rather than coupling the applications directly.
