"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const FETCH_OPTS: RequestInit = { credentials: "include" };

function crudBasePath(endpoint: string) {
  const i = endpoint.indexOf("?");
  return i === -1 ? endpoint : endpoint.slice(0, i);
}

interface UseCrudOptions {
  /** Auto-fetch on mount */
  autoFetch?: boolean;
}

interface CrudState<T> {
  items: T[];
  isLoading: boolean;
  error: string | null;
}

export function useCrud<T extends { _id?: string }>(
  endpoint: string,
  options: UseCrudOptions = {}
) {
  const { autoFetch = true } = options;
  const [state, setState] = useState<CrudState<T>>({
    items: [],
    isLoading: true,
    error: null,
  });

  const basePath = crudBasePath(endpoint);

  const fetchItems = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const res = await fetch(endpoint, FETCH_OPTS);
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          (data && typeof data === "object" && "error" in data && String((data as { error?: string }).error)) ||
          res.statusText ||
          "Failed to fetch";
        throw new Error(msg);
      }
      setState({
        items: Array.isArray(data) ? data : data?.data || [],
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      setState((s) => ({ ...s, isLoading: false, error: err.message ?? "Failed to fetch" }));
    }
  }, [endpoint]);

  useEffect(() => {
    if (autoFetch) fetchItems();
  }, [autoFetch, fetchItems]);

  const create = async (body: Partial<T>) => {
    try {
      const res = await fetch(basePath, {
        ...FETCH_OPTS,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Create failed");
      }
      toast.success("Created successfully");
      await fetchItems();
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  const update = async (id: string, body: Partial<T>) => {
    try {
      const res = await fetch(`${basePath}/${id}`, {
        ...FETCH_OPTS,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Update failed");
      }
      toast.success("Updated successfully");
      await fetchItems();
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  const remove = async (id: string) => {
    try {
      const res = await fetch(`${basePath}/${id}`, { ...FETCH_OPTS, method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Deleted successfully");
      await fetchItems();
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  return {
    ...state,
    refetch: fetchItems,
    create,
    update,
    remove,
  };
}
