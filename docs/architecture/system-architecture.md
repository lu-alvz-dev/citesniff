# System Architecture

## Architectural Goal

CiteSniff must support reliable source processing, evidence retrieval, evidence verification, and APA 7 citation generation while maintaining clear separation of responsibilities.

## High-Level Architecture

```text
┌─────────────────────────────┐
│           Client            │
│      React + TypeScript     │
└──────────────┬──────────────┘
               │
               │ HTTP
               ▼
┌─────────────────────────────┐
│          Express            │
│       API / HTTP Layer      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Application Layer     │
│                             │
│ Source Processing           │
│ Evidence Retrieval          │
│ Evidence Verification       │
│ Metadata                    │
│ APA Generation              │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        Data Layer           │
│     PostgreSQL + pgvector   │
└─────────────────────────────┘
```

## Separation of Responsibilities

### HTTP Layer

Responsible for:

- Request validation.
- Authentication when implemented.
- HTTP response formatting.
- Error handling.

The HTTP layer should not contain document-processing or evidence-selection logic.

### Application Services

Responsible for business operations such as:

- Processing sources.
- Retrieving evidence.
- Verifying quotations.
- Generating citations.
- Generating references.
- Data Layer

Responsible for:

- Database queries.
- Persistence.
- Vector search.
- Source metadata storage.

## Evidence Flow

```text
User Text
    ↓
Claim Detection
    ↓
Source Search
    ↓
Candidate Passages
    ↓
Semantic Ranking
    ↓
Exact Quote Candidate
    ↓
Source Verification
    ↓
Verified Evidence
    ↓
APA Generation
```

## Reliability Boundary

The system must distinguish between:

Generated Information

and:

Verified Source Evidence

Only verified source evidence may be presented as a quotation from the source.

## Performance Strategy

Document processing may be computationally expensive.

The final architecture will therefore avoid performing large document processing tasks synchronously inside ordinary Express request handlers.

A background processing mechanism may be introduced when document-processing requirements justify it.

## Architectural Principle

The architecture prioritizes traceability over convenience.

A result that cannot be reliably traced to the source should not be returned as verified evidence.
