# Backend Foundation

## Context

After establishing the frontend foundation and the initial evidence verification logic, the next development stage was to establish the backend foundation for CiteSniff.

The goal was not to build application features yet. The goal was to create a small, executable backend that could later support source processing, evidence retrieval, evidence verification, and citation generation.

The backend was initialized as a separate application from the frontend.

## Backend Stack

The backend uses:

```text

Node.js
Express
TypeScript
tsx for development execution
```

The backend is maintained independently from the React client. It has its own **package.json**, dependencies, TypeScript configuration, and development scripts.

## Initial Structure

The first backend structure was intentionally small:

```text
server/
├── src/
│   ├── app.ts
│   └── server.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

No additional directories were created at this stage.

The intention is to introduce new architectural layers only when an actual responsibility requires them.

## TypeScript and Node Configuration

The backend uses a dedicated TypeScript configuration rather than sharing the frontend configuration.

The configuration targets Node.js 20+ and uses Node's ESM module model through **NodeNext**.

The configuration also enables strict type checking and additional safety options such as:

**strict**
**noUncheckedIndexedAccess**
**exactOptionalPropertyTypes**
**verbatimModuleSyntax**
**isolatedModules**

The reasoning behind this configuration is documented separately in:

**docs/decisions/use-typescript-node-configuration.md**

## A Configuration Problem

After creating the first backend files, TypeScript reported an error when processing the following imports and exports:

ECMAScript imports and exports cannot be written in a CommonJS file under 'verbatimModuleSyntax'.

The problem was not related to Express.

The TypeScript configuration was using **NodeNext**, but the backend **package.json** did not yet declare the package as an ECMAScript module.

The solution was to add:

```json
"type": "module"
```

to **server/package.json**.

This allowed TypeScript and Node to interpret the backend source files consistently as ES modules.

The existing **NodeNext** configuration was kept rather than weakening the module configuration to accommodate the error.

## Separating the Application from the Server

Two entry points were introduced:

```text
src/app.ts
src/server.ts
```

**app.ts** creates and configures the Express application:

```js
import express from "express";

const app = express();

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
```

**server.ts** is responsible for starting the HTTP server:

```js
import app from "./app.js";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`CiteSniff server running on port ${PORT}`);
});
```

This establishes an important separation:

```text
app.ts
  → Express application and routes
```

```text
server.ts
  → HTTP server startup
```

The application can therefore be imported independently without automatically opening a network port.

This will become useful when HTTP-level tests are introduced.

## Development Runtime

The backend development script uses **tsx**:

```json
"dev": "tsx watch src/server.ts"
```

This allows TypeScript source files to be executed directly during development and automatically restarted when source files change.

The development server successfully started with:

CiteSniff server running on port 3000

## First Runtime Check

A minimal health-check endpoint was added:

GET /health

The endpoint was tested against the running Express server.

The response was:

```json
{
  "status": "ok"
}
```

This confirmed that the complete path from the HTTP request to the Express application and JSON response was functioning.

The health endpoint is intentionally minimal. It is not a CiteSniff business feature; it is a runtime verification mechanism for the backend foundation.

## Validation

The backend was validated at multiple levels.

TypeScript compilation:

```bash
npx tsc --noEmit
```

Completed without errors.

The production build:

```bash
npm run build
```

Also completed successfully and generated the compiled JavaScript output and TypeScript metadata in **dist/**.

Finally, the development server was executed with:

```bash
npm run dev
```

and the **/health** endpoint returned the expected response.

The validation therefore covered:

```text

TypeScript source
↓
Type checking
↓
Compilation
↓
Node.js runtime
↓
Express
↓
HTTP request
↓
JSON response
```

## Result

The backend foundation is now operational.

Implemented:

Node.js backend application.
Express HTTP layer.
TypeScript configuration.
ESM module configuration.
Development execution with **tsx**.
Separate application and server entry points.
**GET /health**.
Successful TypeScript validation.
Successful backend build.
Successful runtime validation.

The backend is now ready for the next stage of development.

## What Comes Next

The next development work should introduce actual CiteSniff backend behavior rather than adding infrastructure without a concrete requirement.

The next architectural decisions will be driven by the evidence workflow, particularly the relationship between:

```text

Source
↓
Source content
↓
Evidence
↓
Verification
↓
Citation
```

Additional backend layers will be introduced only when they are needed to implement those responsibilities.

This keeps the architecture incremental and prevents the project from accumulating empty empty folders before their purpose is clear.
