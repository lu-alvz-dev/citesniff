# Moving Evidence Verification to the Backend

## Context

CiteSniff initially implemented quote verification in the frontend. The function checked whether a quotation existed in the supplied source text and whether it contained between five and fifty words.

As the backend foundation became operational, the verification implementation and its tests were moved from the client to the server.

## The Problem

The original implementation lived in:

```text
client/src/domain/evidence/verifyQuote.ts
client/tests/unit/evidence/verifyQuote.test.ts
```

Keeping this implementation in the frontend no longer matched the evolving application structure.

The backend needed to own the verification logic, while the frontend needed to remain focused on the user interface.

## Implementation

The implementation and its unit tests were moved to:

```text
server/src/domain/analysis/verifyQuote.ts
server/tests/unit/analysis/verifyQuote.test.ts
```

The obsolete frontend domain and test directories were removed after the migration.

The backend implementation retained the existing verification behavior.

## Verification Tests

The backend testing covers four cases:

- Accept an exact quotation found in the source.
- Reject a quotation that does not exist in the source.
- Reject quotations containing fewer than five words.
- Reject quotations containing more than fifty words.

The four tests passed after the migration.

## Frontend Cleanup

After moving the tests, the frontend no longer needed its dedicated Vitest configuration or test TypeScript configuration.

The obsolete `tsconfig.test.json` file was removed, and the Vite configuration was simplified to its remaining responsibilities.

The frontend lint and production build commands completed successfully after these changes.

The default React SVG assets were also removed. The `public/` directory was retained for potential application assets, while `dist/` remained a generated build directory excluded from Git.

## Result

The quote verification function and its unit tests now reside in the backend.

The frontend no longer contains the previous domain implementation or its dedicated test setup.

The migration was validated by the four passing backend tests and the successful frontend lint and build checks.

## Remaining Work

The current function verifies quotation length and exact text inclusion. It does not yet normalize whitespace, extract PDF or website content, retrieve supporting passages, or expose a verification API endpoint.
Those capabilities remain future development work.
