/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table";
import { apiClient, type PaginationParams } from "@/lib/api-client";

export interface UseDataTableOptions<T> {
  endpoint: string;
  columns: ColumnDef<T>[];
  initialSorting?: SortingState;
  initialColumnFilters?: ColumnFiltersState;
  enableServerSidePagination?: boolean;
  enableServerSideSorting?: boolean;
  enableServerSideFiltering?: boolean;
  pageSize?: number;
  filterColumnKey?: keyof T;
}

export interface UseDataTableReturn<T> {
  table: ReturnType<typeof useReactTable<T>>;
  data: T[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  refetch: () => Promise<void>;
}

export function useDataTable<T extends { id: string }>({
  endpoint,
  columns,
  initialSorting = [],
  initialColumnFilters = [],
  enableServerSidePagination = false,
  enableServerSideSorting = false,
  enableServerSideFiltering = false,
  pageSize = 10,
  filterColumnKey,
}: UseDataTableOptions<T>): UseDataTableReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [serverPagination, setServerPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: PaginationParams = {};

      if (enableServerSidePagination) {
        params.page = pagination.pageIndex + 1;
        params.limit = pagination.pageSize;
      }

      if (enableServerSideSorting && sorting.length > 0) {
        const sort = sorting[0];
        params.sortBy = sort.id;
        params.sortOrder = sort.desc ? "desc" : "asc";
      }

      if (
        enableServerSideFiltering &&
        columnFilters.length > 0 &&
        filterColumnKey
      ) {
        const filter = columnFilters.find((f) => f.id === filterColumnKey);
        if (filter?.value) {
          params.search = String(filter.value);
        }
      }

      const response = await apiClient.get<
        T[] | { data: T[]; pagination: any }
      >(endpoint, params as Record<string, string | number | undefined>);

      if (response.error) {
        setError(response.error);
        setData([]);
        return;
      }

      if (response.data) {
        // Check if response has pagination structure
        if (
          typeof response.data === "object" &&
          "data" in response.data &&
          "pagination" in response.data
        ) {
          const paginatedData = response.data as {
            data: T[];
            pagination: any;
          };
          setData(paginatedData.data);
          setServerPagination({
            page: paginatedData.pagination.page,
            limit: paginatedData.pagination.limit,
            total: paginatedData.pagination.total,
            totalPages: paginatedData.pagination.totalPages,
          });
        } else {
          setData(response.data as T[]);
          setServerPagination(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    endpoint,
    enableServerSidePagination,
    enableServerSideSorting,
    enableServerSideFiltering,
    pagination,
    sorting,
    columnFilters,
    filterColumnKey,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const table = useReactTable({
    data,
    columns,
    pageCount: serverPagination?.totalPages,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enableServerSidePagination
      ? undefined
      : getPaginationRowModel(),
    getSortedRowModel: enableServerSideSorting
      ? undefined
      : getSortedRowModel(),
    getFilteredRowModel: enableServerSideFiltering
      ? undefined
      : getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: enableServerSidePagination,
    manualSorting: enableServerSideSorting,
    manualFiltering: enableServerSideFiltering,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return {
    table,
    data,
    isLoading,
    error,
    pagination: serverPagination,
    refetch: fetchData,
  };
}
