import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./openapi/openapi.yaml",
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
    { name: "@hey-api/sdk", validator: true },
    "@tanstack/react-query",
  ],
});
