# Use Prettier for Code Formatting

## Context

CiteSniff already had an ESLint configuration provided by the Vite React and TypeScript template.

ESLint is responsible for identifying code-quality problems and enforcing development rules. The project also needs consistent formatting across the codebase.

This created a decision about whether formatting should be handled by ESLint or by a dedicated formatting tool.

## Challenge

The project needs both code-quality checks and consistent code formatting, while keeping each tool focused on a clear responsibility.

## Options Considered

### Option A — Use ESLint for Formatting

ESLint could handle both code-quality rules and formatting rules.

This would reduce the number of tools, but it would combine two different responsibilities in the same configuration.

### Option B — Use Prettier Independently

Prettier could be used as the dedicated formatting tool, while ESLint remains focused on code quality.

This requires coordination between the two tools to prevent conflicting formatting rules.

## Decision

Use **Prettier** as the formatting tool and **eslint-config-prettier** to prevent ESLint rules from conflicting with Prettier.

The responsibilities are therefore separated:

```text
ESLint   → code quality
Prettier → code formatting
```

## Rationale

This approach gives each tool a clear responsibility.

ESLint can focus on identifying code-quality problems, while Prettier handles consistent formatting across the codebase.

Using **eslint-config-prettier** prevents ESLint from enforcing formatting rules that could conflict with Prettier.

This keeps the development tooling easier to understand and maintain.

## Consequences

### Positive

Clear separation between code quality and formatting.
Consistent formatting across the project.
ESLint remains focused on code-quality rules.
Prettier provides a dedicated formatting process.
Reduced risk of conflicting ESLint and Prettier rules.

### Negative

The project uses an additional development tool.
ESLint and Prettier require coordination.

## Follow-up

Formatting and linting will remain separate responsibilities as the project grows.

If additional development tools are introduced, each tool should have a clear purpose and should not duplicate responsibilities unnecessarily.
