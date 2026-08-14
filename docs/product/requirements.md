# Requirements

## Functional Requirements

### 01 — User Text Validation

The system must allow users to enter text that is 100 to 300 words long.

### 02 — PDF Source

The system must take, read, or support PDF files as input

### 03 — Website Source

The system must allow users to input a public website link as an input source.

### 04 — Claim Detection

The system extracts key claims, concepts, names, and facts from the user's input.

### 05 — Evidence Retrieval

The system shall search the provided source for passages that may support the identified claims.

### 06 — Evidence Selection

The system will choose the best matching evidence using meaning and source checks.

### 07 — Exact Quotation

The system shall return a quotation extracted from the provided source.

### 08 — Quote Length

The quote must have between 5 and 50 words.

### 09 — Quote Verification

The selected quotation shall be verified against the original source before being returned.

### 10 — PDF Page

For PDF sources, the system shall preserve and return the page associated with the selected evidence whenever available.

### 11 — Parenthetical Citation

The software must create an APA 7 parenthetical citation from checked source data.

### 12 — Bibliographic Reference

The system shall generate an APA 7 bibliographic reference using verified source metadata.

### 13 — Insufficient Evidence

The system must indicate when no sufficiently reliable supporting evidence can be verified.

## Architecture Requirements

### 01 — Maintainability

Divide app duties into single-focus parts.

### 02 — Reusability

Common features must be built once and reused when needed

### 03 — Testability

Core business logic must be testable independently from the HTTP layer.

### 04 — Traceability

Returned evidence must be traceable to the source from which it was extracted.

### 05 — Security

User-provided files, URLs, and data shall be validated before processing.

### 06 — Performance

Long-running source-processing operations should not unnecessarily block HTTP request handling.

### 07 — Reliability

The system should return no result over returning unverified evidence.

### 08 — Documentation

Important technical decisions shall be documented using Architecture Decision Records.

### 09 — Code Quality

The code should prioritize clear responsibilities, reusable logic, consistent naming, and minimal duplication.
