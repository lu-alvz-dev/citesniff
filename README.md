# CiteSniff

> **Follow the evidence.**

CiteSniff is an evidence-first AI research assistant designed to help users find verifiable supporting evidence for academic writing.

The application analyzes a user-provided text, identifies relevant claims and concepts, searches a user-provided PDF or website, retrieves supporting evidence from the original source, and generates an APA 7 parenthetical citation and bibliographic reference.

The central principle of CiteSniff is simple:

> **Evidence must come from the source before a citation can be generated.**

---

## Problem

Students, researchers, educators, and writers often need to support statements in their academic writing with reliable sources.

Finding appropriate evidence manually can be time-consuming, especially when the source is a long PDF or a complex website.

AI tools can make this process faster, but they introduce an important risk: hallucinated evidence.

An AI model may generate a plausible quotation, author, publication year, or page number that does not actually exist in the provided source.

CiteSniff is designed to address this problem by making source traceability a core architectural requirement.

---

## Solution

CiteSniff follows an evidence-first workflow:

```text
User Text
    ↓
Claim and Concept Detection
    ↓
Source Processing
    ↓
Evidence Retrieval
    ↓
Candidate Evidence
    ↓
Evidence Verification
    ↓
Exact Quotation
    ↓
APA 7 Citation
    ↓
APA 7 Reference
```

If reliable evidence cannot be verified, CiteSniff should return a clear indication that sufficient evidence was not found instead of generating an unsupported quotation or citation.

---

## Core Principle

CiteSniff must never present generated text as source evidence unless that evidence can be traced back to the provided source.

For quotations, the system must verify that the selected quotation exists in the original source.

The initial quotation requirements are:

- Minimum length: 5 words.
- Maximum length: 50 words.
- The quotation must exist in the provided source.
- The quotation must preserve the original wording.
- PDF quotations should include the source page when available.
- Website evidence should include the source URL.

---

## Initial Features

### Source Processing

- PDF document ingestion.
- Public website ingestion.
- Text extraction.
- PDF page preservation.
- Website content extraction.

### Evidence Retrieval

- Identification of relevant concepts and claims.
- Semantic search.
- Candidate evidence retrieval.
- Evidence verification.
- Exact quotation extraction.

### APA 7

- Parenthetical citations.
- Bibliographic references.
- Author and publication year extraction.
- PDF page identification.
- Website source identification.

### Reliability

- Source traceability.
- Exact quotation verification.
- Rejection of unsupported evidence.
- Structured processing results.

---

## Technology Stack

### Frontend

#### Current

- React
- Vite
- TypeScript
- ESLint
- Prettier
- Vitest

#### Planned

- Tailwind CSS
- TanStack Query
- React Hook Form
- Zod
- Axios

### Backend

#### Planned

- Node.js
- Express
- TypeScript

### Document Processing

#### Planned

- pdfjs-dist
- Mozilla Readability
- Cheerio

### Data

#### Planned

- PostgreSQL
- pgvector

### AI and Retrieval

#### Planned

- Transformers.js
- Vector embeddings
- Retrieval-Augmented Generation
- Pluggable AI provider architecture

---

## Architecture

CiteSniff separates the HTTP layer from the application and domain logic.

```text
┌──────────────────────────────────────────────┐
│                  Frontend                    │
│             React + TypeScript               │
└──────────────────────┬───────────────────────┘
                       │
                       │ HTTP API
                       ▼
┌──────────────────────────────────────────────┐
│                  Express                     │
│              HTTP / API Layer                │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                Application                   │
│                Services                      │
├──────────────────────────────────────────────┤
│ Source Processing                            │
│ Evidence Retrieval                           │
│ Evidence Verification                        │
│ Citation Generation                          │
│ Reference Generation                         │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                 Data Layer                   │
│            PostgreSQL + pgvector             │
└──────────────────────────────────────────────┘
```

Long-running document processing will be separated from the HTTP request lifecycle as the application evolves.

---

## Project Structure

```text
CiteSniff/
│
├── client/
│   ├── .env.example
│   ├── package.json
│   ├── src/
│   │   └── domain/
│   │       └── evidence/
│   │           └── verifyQuote.ts
│   ├── tests/
│   │   └── unit/
│   │       └── evidence/
│   │           └── verifyQuote.test.ts
│   └── ...
│
├── server/
│   ├── .env.example
│   ├── package.json
│   └── src/
│
├── docs/
│   ├── architecture/
│   ├── decisions/
│   ├── development/
│   └── product/
│
├── .gitignore
├── .gitattributes
├── LICENSE
└── README.md
```

## Development

### Requirements

- Node.js 20 or later
- npm
- Git

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd CiteSniff
```

CiteSniff is organized as two independent applications. Each application manages its own dependencies and development scripts.

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

### Frontend Development

Available Frontend development commands currently include:

```bash
npm run dev
npm run build
npm run lint
npm run format
npm run format:check
npm run test
```

## Testing

CiteSniff uses automated tests to protect important domain behavior.

The current frontend test suite uses Vitest.

Run tests with:

```bash
cd client
npm run test
```

### Code Quality

The frontend uses ESLint and Prettier to maintain consistent code quality and formatting.

Run linting:

```bash
cd client
npm run lint
```

Format the code:

```bash
cd client
npm run format
```

Verify formatting:

```bash
cd client
npm run format:check
```

Production build verification:

```bash
cd client
npm run build
```

The project uses .gitattributes to normalize text-file handling across development environments.

---

## Documentation

Project documentation is organized by responsibility.

### Product

Contains the problem definition, requirements, challenges, and roadmap.

### Architecture

Contains system architecture, data flow, and application architecture documentation.

### Decisions

Contains Architecture Decision Records (ADRs) explaining important technical choices.

### Development

Contains the engineering journal documenting the implementation process, challenges, solutions, testing, and lessons learned.

---

## Engineering Principles

CiteSniff is developed around the following principles:

1. **Evidence before generation.**
2. **Separation of responsibilities.**
3. **Reusable components and services.**
4. **Explicit validation.**
5. **Testable business logic.**
6. **Traceable sources.**
7. **Secure handling of user input.**
8. **Meaningful Git history.**
9. **Documented technical decisions.**
10. **Incremental development.**

---

## Project Status

CiteSniff is currently under active development.

The repository foundation and frontend application have been initialized.

Current development work includes:

Frontend foundation.
Development tooling.
Code formatting.
Linting.
Automated testing.
Initial evidence-verification domain logic.

The backend has not yet been initialized.

The project is being built incrementally, with each development stage documented through technical decisions, implementation notes, tests, and Git commits.

---

## Roadmap

### Phase 1 — Foundation

- [✔] Repository initialization
- [✔] Frontend initialization
- [✔] Frontend development tooling
- [✔] Code formatting
- [✔] Frontend testing infrastructure
- [✔] Initial evidence verification logic
- [ ] Backend initialization
- [ ] Backend Development tooling
- [ ] Architecture documentation

### Phase 2 — Source Processing

- [ ] PDF upload
- [ ] PDF text extraction
- [ ] Page preservation
- [ ] Website extraction
- [ ] Source metadata

### Phase 3 — Evidence Retrieval

- [ ] Text chunking
- [ ] Embeddings
- [ ] Vector search
- [ ] Candidate retrieval
- [ ] Evidence ranking

### Phase 4 — Verification

- [ ] Exact quotation verification
- [ ] Quote length validation
- [ ] Source traceability
- [ ] Evidence confidence

### Phase 5 — APA 7

- [ ] Parenthetical citation generation
- [ ] Reference generation
- [ ] PDF page support
- [ ] Website citation support

### Phase 6 — Application

- [ ] User interface
- [ ] Source upload
- [ ] Analysis workflow
- [ ] Evidence results
- [ ] Error states

### Phase 7 — Production

- [ ] Authentication
- [ ] Database persistence
- [ ] Security hardening
- [ ] Observability
- [ ] Deployment
- [ ] Performance optimization

---

## License

This project is licensed under the MIT License.

---

## Creator

Luis Alvarez
