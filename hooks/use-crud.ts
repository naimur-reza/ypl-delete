"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

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

  const fetchItems = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setState({ items: Array.isArray(data) ? data : data.data || [], isLoading: false, error: null });
    } catch (err: any) {
      setState((s) => ({ ...s, isLoading: false, error: err.message }));
    }
  }, [endpoint]);

  useEffect(() => {
    if (autoFetch) fetchItems();
  }, [autoFetch, fetchItems]);

  const create = async (body: Partial<T>) => {
    try {
      const res = await fetch(endpoint, {
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
      const res = await fetch(`${endpoint}/${id}`, {
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
      const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
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
