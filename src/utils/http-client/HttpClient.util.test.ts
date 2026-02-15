import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { HttpClient } from "./HttpClient.util";

describe("utils/HttpClient", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    mockFetch.mockReset();
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function createJsonResponse(body: unknown, status = 200, ok = true) {
    return Promise.resolve({
      ok,
      status,
      statusText: ok ? "OK" : "Error",
      headers: {
        get: (name: string) => (name === "content-type" ? "application/json" : null),
      },
      json: () => Promise.resolve(body),
    });
  }

  function createEmptyResponse(status = 204) {
    return Promise.resolve({
      ok: true,
      status,
      statusText: "No Content",
      headers: {
        get: () => null,
      },
    });
  }

  describe("constructor", () => {
    it("should create instance with defaults", () => {
      const client = new HttpClient();
      expect(client).toBeInstanceOf(HttpClient);
    });

    it("should create instance with custom baseUrl and headers", () => {
      const client = new HttpClient({
        baseUrl: "/api",
        defaultHeaders: { Authorization: "Bearer token" },
      });
      expect(client).toBeInstanceOf(HttpClient);
    });
  });

  describe("HTTP methods", () => {
    it("should make GET request", async () => {
      mockFetch.mockReturnValue(createJsonResponse({ success: true, data: { id: 1 } }));
      const client = new HttpClient({ baseUrl: "/api" });

      await client.get({ endpoint: "/users" });

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url, config] = mockFetch.mock.calls[0];
      expect(url).toContain("/api/users");
      expect(config.method).toBe("GET");
    });

    it("should make POST request with body", async () => {
      mockFetch.mockReturnValue(createJsonResponse({ success: true, data: { id: 1 } }));
      const client = new HttpClient({ baseUrl: "/api" });

      await client.post({
        endpoint: "/users",
        body: { name: "John" },
      });

      const [, config] = mockFetch.mock.calls[0];
      expect(config.method).toBe("POST");
      expect(config.body).toBe(JSON.stringify({ name: "John" }));
    });

    it("should make PUT request", async () => {
      mockFetch.mockReturnValue(createJsonResponse({ success: true, data: {} }));
      const client = new HttpClient({ baseUrl: "/api" });

      await client.put({ endpoint: "/users/1", body: { name: "Jane" } });

      const [, config] = mockFetch.mock.calls[0];
      expect(config.method).toBe("PUT");
    });

    it("should make PATCH request", async () => {
      mockFetch.mockReturnValue(createJsonResponse({ success: true, data: {} }));
      const client = new HttpClient({ baseUrl: "/api" });

      await client.patch({ endpoint: "/users/1", body: { name: "Jane" } });

      const [, config] = mockFetch.mock.calls[0];
      expect(config.method).toBe("PATCH");
    });

    it("should make DELETE request", async () => {
      mockFetch.mockReturnValue(createJsonResponse({ success: true, data: null }));
      const client = new HttpClient({ baseUrl: "/api" });

      await client.delete({ endpoint: "/users/1" });

      const [, config] = mockFetch.mock.calls[0];
      expect(config.method).toBe("DELETE");
    });
  });

  describe("query params", () => {
    it("should append query params to URL", async () => {
      mockFetch.mockReturnValue(createJsonResponse({ success: true, data: [] }));
      const client = new HttpClient({ baseUrl: "/api" });

      await client.get({
        endpoint: "/users",
        params: { page: 1, limit: 10 },
      });

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain("page=1");
      expect(url).toContain("limit=10");
    });

    it("should filter out null and undefined params", async () => {
      mockFetch.mockReturnValue(createJsonResponse({ success: true, data: [] }));
      const client = new HttpClient({ baseUrl: "/api" });

      await client.get({
        endpoint: "/users",
        params: { page: 1, filter: null, sort: undefined },
      });

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain("page=1");
      expect(url).not.toContain("filter");
      expect(url).not.toContain("sort");
    });

    it("should filter out empty string params", async () => {
      mockFetch.mockReturnValue(createJsonResponse({ success: true, data: [] }));
      const client = new HttpClient({ baseUrl: "/api" });

      await client.get({
        endpoint: "/users",
        params: { page: 1, search: "" },
      });

      const [url] = mockFetch.mock.calls[0];
      expect(url).not.toContain("search");
    });
  });

  describe("headers", () => {
    it("should include Content-Type by default", async () => {
      mockFetch.mockReturnValue(createJsonResponse({ success: true, data: {} }));
      const client = new HttpClient();

      await client.get({ endpoint: "/test" });

      const [, config] = mockFetch.mock.calls[0];
      expect(config.headers["Content-Type"]).toBe("application/json");
    });

    it("should merge default headers with request headers", async () => {
      mockFetch.mockReturnValue(createJsonResponse({ success: true, data: {} }));
      const client = new HttpClient({
        defaultHeaders: { Authorization: "Bearer token" },
      });

      await client.get({
        endpoint: "/test",
        config: { headers: { "X-Custom": "value" } },
      });

      const [, config] = mockFetch.mock.calls[0];
      expect(config.headers["Authorization"]).toBe("Bearer token");
      expect(config.headers["X-Custom"]).toBe("value");
    });
  });

  describe("callbacks", () => {
    it("should call onSuccess for successful responses", async () => {
      mockFetch.mockReturnValue(createJsonResponse({ success: true, data: { id: 1 } }));
      const client = new HttpClient();
      const onSuccess = vi.fn();

      await client.get({ endpoint: "/test", onSuccess });

      expect(onSuccess).toHaveBeenCalledWith({ id: 1 }, 200);
    });

    it("should call onError for failed JSON responses with success: false", async () => {
      mockFetch.mockReturnValue(createJsonResponse({ success: false, data: { message: "Not found" } }));
      const client = new HttpClient();
      const onError = vi.fn();

      await client.get({ endpoint: "/test", onError });

      expect(onError).toHaveBeenCalledWith({ message: "Not found" }, 200);
    });

    it("should call onComplete regardless of outcome", async () => {
      mockFetch.mockReturnValue(createJsonResponse({ success: true, data: {} }));
      const client = new HttpClient();
      const onComplete = vi.fn();

      await client.get({ endpoint: "/test", onComplete });

      expect(onComplete).toHaveBeenCalledOnce();
    });

    it("should call onHttpError on network errors", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));
      const client = new HttpClient();
      const onHttpError = vi.fn();
      const onComplete = vi.fn();

      await expect(client.get({ endpoint: "/test", onHttpError, onComplete })).rejects.toThrow("Network error");

      expect(onHttpError).toHaveBeenCalledWith(expect.any(Error));
      expect(onComplete).toHaveBeenCalledOnce();
    });
  });

  describe("response handling", () => {
    it("should return null for empty responses", async () => {
      mockFetch.mockReturnValue(createEmptyResponse());
      const client = new HttpClient();

      const result = await client.get({ endpoint: "/test" });

      expect(result).toBeNull();
    });

    it("should return data from JSON responses", async () => {
      mockFetch.mockReturnValue(createJsonResponse({ success: true, data: { name: "test" } }));
      const client = new HttpClient();

      const result = await client.get({ endpoint: "/test" });

      expect(result).toEqual({ name: "test" });
    });

    it("should handle non-ok responses with standard error format", async () => {
      mockFetch.mockReturnValue(
        Promise.resolve({
          ok: false,
          status: 400,
          statusText: "Bad Request",
          headers: { get: () => "application/json" },
          json: () => Promise.resolve({ success: false, data: { field: "invalid" } }),
        }),
      );

      const client = new HttpClient();
      const onError = vi.fn();

      const result = await client.get({ endpoint: "/test", onError });

      expect(onError).toHaveBeenCalledWith({ field: "invalid" }, 400);
      expect(result).toEqual({ field: "invalid" });
    });
  });
});
