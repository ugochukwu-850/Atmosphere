/**
 * Helpers around the hey-api generated SDK (src/lib/api/generated).
 * Regenerate it with `pnpm api:generate` after editing openapi/openapi.yaml.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type SdkResult<T> = { data?: T; error?: unknown; response?: Response };

/** Turn an SDK result into its data, or throw an ApiError (status 0 = network failure). */
export async function unwrap<T>(result: Promise<SdkResult<T>>): Promise<T> {
  const { data, error, response } = await result;
  if (error === undefined && response?.ok) return data as T;

  // API error body: { error: string, code?: "validation_error" | "not_found" | ... }
  const message =
    (error as { error?: string } | undefined)?.error ??
    (response
      ? `Request failed (${response.status})`
      : "Could not reach the server");
  throw new ApiError(response?.status ?? 0, message, error);
}
