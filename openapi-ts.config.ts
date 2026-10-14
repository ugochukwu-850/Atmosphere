import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./openapi/backend.openapi.json",
  output: {
    path: "./src/lib/api/generated",
    postProcess: ["prettier"],
  },
  plugins: [
    {
      name: "@hey-api/client-next",
      // Base URL and auth header are set at runtime in src/lib/api/hey-api.ts.
      runtimeConfigPath: "./src/lib/api/hey-api",
    },
    "@hey-api/typescript",
    "zod",
    // Validate what we send; responses are normalized in src/lib/data/normalize.ts
    // (response validation would strip fields the spec omits, e.g. pin photoUrl).
    { name: "@hey-api/sdk", validator: { request: true, response: false } },
    "@tanstack/react-query",
  ],
});
