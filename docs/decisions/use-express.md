# Use Express for the Backend HTTP Layer

## Context

CiteSniff requires a backend HTTP layer capable of exposing APIs for source ingestion, analysis, evidence retrieval, and citation generation.

The project needs a maintainable architecture with clear separation between HTTP handling and application logic.

Two candidate Node.js frameworks considered during the initial analysis were Express and Fastify.

## Decision

Use Express as the backend HTTP framework.

## Thinking Process

Express was selected because:

- I already have Node.js and Express experience to build my backend.
- Express offers a stable and well-known way to handle web traffic.
- The application can achieve maintainability and performance through architecture rather than relying solely on framework-level optimization.
- Separating controllers, services, repositories, and infrastructure will prevent the HTTP layer from becoming tightly coupled to business logic.
- Express provides the essential backend foundation needed for a full-stack role.

## Performance Strategy

Express will not be responsible for executing long-running document-processing operations directly inside HTTP request handlers.

As processing requirements grow, document ingestion and embedding generation will be moved to asynchronous background processing.

Performance will therefore be treated as an architectural concern rather than only a framework-selection concern.

## Consequences

### Positive

- Familiar development model.
- Mature ecosystem.
- Clear HTTP abstraction is an easy protocol wrapper.
- Huge set of connecting tools (middleware).
- Easy integration with the selected Node.js tooling.

### Negative

- Some performance characteristics may require more explicit architectural design than specialized frameworks.
- Additional infrastructure may be required for background processing.

## Alternatives

#### Fastify

Fastify provides strong performance characteristics and a structured plugin architecture.

It was not selected because the project prioritizes demonstrating maintainable Express architecture and leveraging existing Node.js/Express knowledge.

## Follow-up

Performance assumptions will be validated through implementation and, where appropriate, measurements rather than theoretical comparisons.
