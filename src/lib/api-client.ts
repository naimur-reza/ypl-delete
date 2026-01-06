/**
 * Reusable API client utilities for CRUD operations
 */

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Generic API client with error handling
 */
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        return {
          error: data.error || data.message || "An error occurred",
        };
      }

      return { data };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Network error occurred",
      };
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>
  ): Promise<ApiResponse<T>> {
    const queryString = params
      ? "?" +
        Object.entries(params)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => `${key}=${encodeURIComponent(value!)}`)
          .join("&")
      : "";

    return this.request<T>(`${endpoint}${queryString}`, {
      method: "GET",
    });
  }

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

// Create default instance
export const apiClient = new ApiClient();

/**
 * Entity-specific API clients
 */
export const createEntityApi = <T extends { id: string }>(
  basePath: string
) => ({
  getAll: async (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<T> | T[]>(basePath, params as Record<string, string | number | undefined>),

  getById: async (id: string) => apiClient.get<T>(`${basePath}/${id}`),

  create: async (data: Omit<T, "id" | "createdAt" | "updatedAt">) =>
    apiClient.post<T>(basePath, data),

  update: async (id: string, data: Partial<T>) =>
    apiClient.put<T>(basePath, { id, ...data }),

  delete: async (id: string) => apiClient.delete<void>(basePath, { id }),
});

export const createRestEntityApi = <T extends { id: string }>(
  basePath: string
) => ({
  getAll: async (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<T> | T[]>(basePath, params as Record<string, string | number | undefined>),

  getById: async (id: string) => apiClient.get<T>(`${basePath}/${id}`),

  create: async (data: Omit<T, "id" | "createdAt" | "updatedAt">) =>
    apiClient.post<T>(basePath, data),

  update: async (id: string, data: Partial<T>) =>
    apiClient.put<T>(`${basePath}/${id}`, data),

  delete: async (id: string) => apiClient.delete<void>(`${basePath}/${id}`),
});

