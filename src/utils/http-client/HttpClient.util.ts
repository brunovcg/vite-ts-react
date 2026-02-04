interface RequestOptions<S, E> {
  endpoint: string;
  body?: unknown;
  params?: Record<string, string | number | boolean | null | undefined>;
  config?: RequestInit;
  onSuccess?: (data: S, status: number) => void;
  onError?: (error: E, status: number) => void;
  onHttpError?: (error: Error) => void;
  onComplete?: () => void;
}

export class HttpClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor({
    baseUrl = "",
    defaultHeaders = {},
  }: { baseUrl?: string; defaultHeaders?: HeadersInit } = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = defaultHeaders;
  }

  private async request<S, E>(
    method: string,
    {
      endpoint,
      body,
      params,
      config = {},
      onSuccess,
      onError,
      onHttpError,
      onComplete,
    }: RequestOptions<S, E>,
  ): Promise<S | E | null> {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers = {
      "Content-Type": "application/json",
      ...this.defaultHeaders,
      ...config.headers,
    };

    const configWithHeaders: RequestInit = {
      ...config,
      method,
      headers,
    };

    if (body) {
      configWithHeaders.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url.toString(), configWithHeaders);
      const status = response.status;

      // Handle HTTP errors (non-2xx responses that might not match payload structure)
      if (!response.ok) {
        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch {
          errorData = null;
        }

        const errorMessage =
          (errorData as { message?: string })?.message ||
          `HTTP Error ${status}: ${response.statusText}`;

        const error = new Error(errorMessage);

        // If the server returns our standard error format even on 4xx/5xx, attempts to use onError
        if (
          errorData &&
          typeof errorData === "object" &&
          "success" in errorData &&
          (errorData as { success: boolean }).success === false
        ) {
          const standardError = errorData as { success: boolean; data: E };
          onError?.(standardError.data, status);
          return standardError.data;
        }

        throw error;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = (await response.json()) as { success: boolean; data: S | E };

        if (result.success) {
          onSuccess?.(result.data as S, status);
        } else {
          onError?.(result.data as E, status);
        }

        return result.data;
      }

      // 204 or empty
      return null;
    } catch (error) {
      if (error instanceof Error) {
        onHttpError?.(error);
      }
      throw error;
    } finally {
      onComplete?.();
    }
  }

  public get<S, E = unknown>(options: Omit<RequestOptions<S, E>, "body">): Promise<S | E | null> {
    return this.request<S, E>("GET", options);
  }

  public post<S, E = unknown>(options: RequestOptions<S, E>): Promise<S | E | null> {
    return this.request<S, E>("POST", options);
  }

  public put<S, E = unknown>(options: RequestOptions<S, E>): Promise<S | E | null> {
    return this.request<S, E>("PUT", options);
  }

  public patch<S, E = unknown>(options: RequestOptions<S, E>): Promise<S | E | null> {
    return this.request<S, E>("PATCH", options);
  }

  public delete<S, E = unknown>(
    options: Omit<RequestOptions<S, E>, "body">,
  ): Promise<S | E | null> {
    return this.request<S, E>("DELETE", options);
  }
}
