# Use Vitest for Testing

## Context

CiteSniff uses Vite as the frontend development and build tool.

The project needs a testing framework that can support the current testing needs and grow with the application.

The planned testing strategy includes:

- Unit tests.
- Integration tests.
- Component tests later as the frontend grows.

## Decision

Use **Vitest** as the testing framework for CiteSniff.

The testing stack will be:

```text
Vitest
   │
   ├── Unit tests
   ├── Integration tests
   └── Later: component tests
```

Jest will not be installed.

## Reason

Vitest is designed to work naturally with the Vite ecosystem.

Using Vitest allows the project to keep its development and testing tools aligned with the same modern build environment.

This avoids introducing a separate testing setup that would require additional configuration between Vite, Jest, and other transformation tools.

The intended relationship is:

```text
Vite
   +
Vitest
```

instead of:

```text
Vite
   +
Jest
   +
Additional transformation configuration
```

This provides a more consistent development setup and keeps the testing configuration easier to understand and maintain.

## Alternatives Considered

### Jest

Jest was considered as an alternative testing framework.

It was not selected because the project already uses Vite and Vitest provides a more natural integration with the Vite ecosystem.

Adding Jest would also introduce a separate testing environment alongside the existing Vite development environment.

## Consequences

### Positive

Natural integration with the Vite ecosystem.
One consistent development and testing environment.
Support for unit tests.
Support for integration tests.
Can be extended to component testing later.
Less unnecessary configuration.

### Negative

The project becomes dependent on Vitest for its testing workflow.
Developers familiar only with Jest may need to learn Vitest.

## Follow-up

The testing strategy will grow incrementally.

Unit tests will cover important business and domain logic first. Integration tests will be introduced as application boundaries and backend functionality are implemented.

Component tests may be added later when the frontend requires them.
