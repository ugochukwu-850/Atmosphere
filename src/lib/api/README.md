# API client

The typed backend client will be generated here with
[hey-api](https://heyapi.dev) (`@hey-api/openapi-ts`) from the backend's
OpenAPI spec. It is not set up yet.

When adding it:

- Generate into this folder (e.g. `src/lib/api/generated/`) and don't hand-edit generated files.
- Point the client's base URL at `env.NEXT_PUBLIC_API_URL` from `@/lib/env`.
- Add a `generate:api` script to `package.json`.
- Consider the hey-api TanStack Query plugin, since `@tanstack/react-query` is already wired up in `src/app/providers.tsx`.
