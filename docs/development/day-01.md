# Day 1 — Project Foundation

## Objective

Establish the initial CiteSniff repository and document the problem, requirements, engineering challenges, and initial technical direction before implementing application features.

## Problem

CiteSniff is intended to help users find verifiable supporting evidence for academic writing.

The system must analyze a user-provided text, locate supporting evidence inside a PDF or website, verify the original quotation, and generate APA 7 citation information.

## Primary Engineering Concern

The most important concern identified during the initial analysis is evidence reliability.

A language model can generate plausible but incorrect quotations, page numbers, authors, or publication years.

CiteSniff therefore adopts an evidence-first principle:

Evidence must be retrieved and verified before citation generation.

## Initial Technical Direction

The application will use:

React and TypeScript for the frontend.
Node.js, Express, and TypeScript for the backend.
PostgreSQL and pgvector for persistent and vector data.
pdfjs-dist for PDF processing.
Mozilla Readability and Cheerio for website extraction.
Transformers.js for local embedding experimentation.

## Architectural Direction

The backend will separate HTTP handling from application services and data access.

Long-running document-processing tasks will eventually be separated from the HTTP request lifecycle.

## Decisions

Initial decisions documented during Day 1:

- Use Express as the backend HTTP framework.
- Use TypeScript across frontend and backend.
- Use PostgreSQL as the primary relational database.
- Use pgvector for vector search.
- Preserve PDF page information during document extraction.
- Verify quotations against the original source.
- Reject unsupported evidence instead of generating a plausible substitute.
- Document important architectural decisions using ADRs.

## Implementation

The initial repository structure was created with separate frontend, backend, documentation, architecture, decision, development, and product directories.

## Validation

The repository structure and initial documentation should be reviewed before application dependencies are installed.

## Git History

Day 1 commits should clearly communicate the purpose of each project change.

Planned initial commits:

```bash
chore: initialize CiteSniff project structure
docs: define CiteSniff problem and requirements
docs: define initial system architecture
```

## Lessons Learned

The initial analysis identified that the primary difficulty is not generating an APA citation.

The more important problem is establishing a reliable chain between:

```text
User Claim
    ↓
Source
    ↓
Evidence
    ↓
Exact Quotation
    ↓
Source Location
    ↓
APA Citation
```

This traceability requirement will influence the architecture throughout the project.

## Next Steps

The next development stage will initialize the frontend and backend applications and establish their development tooling.

## Frontend Initialization

The frontend was initialized using the official React and TypeScript Vite template.

The generated ESLint configuration was reviewed and intentionally preserved because it already provides a modern ESLint 10 flat configuration compatible with the selected React and TypeScript stack.

The default Vite demonstration assets and UI were removed to establish a clean CiteSniff application boundary.

No additional frontend tooling was introduced at this stage.

The project will add formatting, testing, and styling tools incrementally so that each dependency has a clearly defined responsibility.
