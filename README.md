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

#### Current

- Node.js
- Express
- TypeScript
- tsx
- ESLint
- Prettier
- Vitest

#### Planned

- Application services
- Backend domain modules
- Data access layer
- PostgreSQL integration
- pgvector integration

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
│                Future Application                   │
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
│                 Future Data Layer                   │
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
│   ├── eslint.config.js
│   ├── tsconfig.json
│   └── src/
│       ├── routes/
│       │   └── health.ts
│       ├── app.ts
│       └── server.ts
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
The dist/ directory generated by the backend TypeScript build is a build artifact and is not part of the source architecture.
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

### Backend Development

Available Backend development commands currently include:

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm run test
npm run test:watch
```

The backend development server runs with **tsx** and starts the Express application from **server/src/server.ts**.

The backend currently exposes a health-check endpoint:

```code
GET /health
```

A successful response is:

```code
{
  "status": "ok"
}
```

## Testing

CiteSniff uses automated tests to protect important domain behavior.
### Frontend
The current frontend test suite uses Vitest.

Run tests with:

```bash
cd client
npm run test
```
### Backend

Vitest is configured as the backend testing framework.

Run backend tests with:
```bash
cd server
npm run test
```

Watch backend tests during development with:
```bash
npm run test:watch
```

The backend application is intentionally separated from the server process so that the Express application can be imported independently for HTTP-level testing.
### Code Quality

Both applications use ESLint and Prettier as development tooling.

#### Frontend

Run linting:
```bash
cd client
npm run lint
```

Format the code:
```bash
npm run format
```

Verify formatting:
```bash
npm run format:check
```

Production build verification:
```bash
npm run build
```

#### Backend

Run linting:
```bash
cd server
npm run lint
```

Format the code:
```bash
npm run format
```

Build the backend:
```bash
npm run build
```

The backend uses ESLint's modern flat configuration through eslint.config.js.

Generated files in dist/ are excluded from ESLint because they are build artifacts rather than source code.

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

The repository foundation, frontend and backend application have been initialized.

Current development work includes:

Frontend foundation.
Frontend development tooling.
Code formatting.
Linting.
Automated testing.
Initial evidence-verification domain logic.
Backend TypeScript and Express foundation.
Backend development runtime.
Backend development tooling.
Backend architecture documentation.
Backend runtime validation.

The project is being built incrementally, with each development stage documented through technical decisions, implementation notes, tests, and Git commits.

---

## Roadmap

### Foundation

- [✔] Repository initialization
- [✔] Frontend initialization
- [✔] Frontend development tooling
- [✔] Code formatting
- [✔] Frontend testing infrastructure
- [✔] Initial evidence verification logic
- [✔] Backend initialization
- [✔] Backend Development tooling
- [✔] Architecture documentation

### Source Processing

- [ ] PDF upload
- [ ] PDF text extraction
- [ ] Page preservation
- [ ] Website extraction
- [ ] Source metadata

### Evidence Retrieval

- [ ] Text chunking
- [ ] Embeddings
- [ ] Vector search
- [ ] Candidate retrieval
- [ ] Evidence ranking

### Verification

- [ ] Exact quotation verification
- [ ] Quote length validation
- [ ] Source traceability
- [ ] Evidence confidence

### APA 7

- [ ] Parenthetical citation generation
- [ ] Reference generation
- [ ] PDF page support
- [ ] Website citation support

### Application

- [ ] User interface
- [ ] Source upload
- [ ] Analysis workflow
- [ ] Evidence results
- [ ] Error states

### Production

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
