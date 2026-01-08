/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  // Build query key based on all parameters that affect the data
  const queryKey = [
    "data-table",
    endpoint,
    enableServerSidePagination ? pagination.pageIndex : null,
    enableServerSidePagination ? pagination.pageSize : null,
    enableServerSideSorting ? sorting : null,
    enableServerSideFiltering ? columnFilters : null,
  ];

  const fetchData = useCallback(async () => {
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

    const response = await apiClient.get<T[] | { data: T[]; pagination: any }>(
      endpoint,
      params as Record<string, string | number | undefined>
    );

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data;
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

  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: fetchData,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
  });

  // Parse the response data
  let tableData: T[] = [];
  let serverPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null = null;

  if (queryData) {
    if (
      typeof queryData === "object" &&
      "data" in queryData &&
      "pagination" in queryData
    ) {
      const paginatedData = queryData as { data: T[]; pagination: any };
      tableData = paginatedData.data;
      serverPagination = {
        page: paginatedData.pagination.page,
        limit: paginatedData.pagination.limit,
        total: paginatedData.pagination.total,
        totalPages: paginatedData.pagination.totalPages,
      };
    } else {
      tableData = queryData as T[];
    }
  }

  const table = useReactTable({
    data: tableData,
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

  const handleRefetch = useCallback(async () => {
    // Invalidate all queries for this endpoint to ensure fresh data
    await queryClient.invalidateQueries({ queryKey: ["data-table", endpoint] });
    await refetch();
  }, [queryClient, endpoint, refetch]);

  return {
    table,
    data: tableData,
    isLoading,
    error: error?.message || null,
    pagination: serverPagination,
    refetch: handleRefetch,
  };
}
