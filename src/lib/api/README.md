# API client

`generated/` is produced by [hey-api](https://heyapi.dev) from
`openapi/openapi.yaml`. Don't hand-edit it; change the spec and run:

```bash
pnpm api:generate
```

What gets generated (see `openapi-ts.config.ts`):

- `sdk.gen.ts`: one function per operation (`login`, `listListings`, `createBooking`, …), with request and response validation through zod
- `types.gen.ts`: TypeScript types for every schema
- `zod.gen.ts`: zod schemas, also reusable for forms
- `@tanstack/react-query.gen.ts`: `…Options` / `…Mutation` helpers for react-query

Runtime config (base URL) lives in `hey-api.ts`. Pass the session token per
call with `{ auth: token }`. Use `unwrap()` from `client.ts` to get the data
or an `ApiError`.

The spec is currently a draft modelled on the demo site. Replace it with the
backend's real spec once it is published.
