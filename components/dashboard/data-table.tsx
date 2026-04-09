"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ───────── Column definition ───────── */
export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  hideable?: boolean;
}

/* ───────── Props ───────── */
interface DataTableProps<T extends { _id?: string }> {
  title: string;
  description?: string;
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchKeys?: string[];
  pageSize?: number;
  actions?: (item: T) => React.ReactNode;
  headerAction?: React.ReactNode;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  sortState?: { key: string; dir: "asc" | "desc" };
  onSortChange?: (sort: { key: string; dir: "asc" | "desc" }) => void;
  sortAccessor?: (item: T, key: string) => string | number | Date | null | undefined;
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  rowClassName?: (item: T) => string;
  hidePagination?: boolean;
  columnVisibilityStorageKey?: string;
}

export function DataTable<T extends { _id?: string }>({
  title,
  description,
  columns,
  data,
  isLoading,
  searchKeys = [],
  pageSize = 10,
  actions,
  headerAction,
  searchValue,
  onSearchValueChange,
  sortState,
  onSortChange,
  sortAccessor,
  selectedIds,
  onSelectedIdsChange,
  rowClassName,
  hidePagination = false,
  columnVisibilityStorageKey,
}: DataTableProps<T>) {
  const [internalSearch, setInternalSearch] = useState("");
  const [internalSortKey, setInternalSortKey] = useState("");
  const [internalSortDir, setInternalSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
    () => columns.map((col) => col.key),
  );
  const search = searchValue ?? internalSearch;
  const sortKey = sortState?.key ?? internalSortKey;
  const sortDir = sortState?.dir ?? internalSortDir;
  const storageKey = columnVisibilityStorageKey
    ? `data-table-columns:${columnVisibilityStorageKey}`
    : "";
  const columnKeysSignature = useMemo(
    () => columns.map((col) => col.key).join("|"),
    [columns],
  );

  useEffect(() => {
    // Keep user selection while allowing new/removed columns to reconcile.
    setVisibleColumnKeys((prev) => {
      const nextByCurrentColumns = columns
        .map((col) => col.key)
        .filter((key) => prev.includes(key));

      if (nextByCurrentColumns.length === 0) {
        return columns.map((col) => col.key);
      }
      return nextByCurrentColumns;
    });
  }, [columnKeysSignature, columns]);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      const validKeys = columns.map((col) => col.key);
      const next = parsed.filter(
        (key): key is string =>
          typeof key === "string" && validKeys.includes(key),
      );
      if (next.length > 0) setVisibleColumnKeys(next);
    } catch {
      // Ignore malformed localStorage payloads.
    }
  }, [columns, storageKey]);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(visibleColumnKeys));
    } catch {
      // Ignore localStorage write errors.
    }
  }, [storageKey, visibleColumnKeys]);

  const visibleColumns = useMemo(() => {
    const visibleSet = new Set(visibleColumnKeys);
    return columns.filter((col) => visibleSet.has(col.key));
  }, [columns, visibleColumnKeys]);

  const hideableColumns = useMemo(
    () => columns.filter((col) => col.hideable !== false),
    [columns],
  );

  const toggleColumnVisibility = (key: string, checked: boolean) => {
    setVisibleColumnKeys((prev) => {
      const current = new Set(prev);
      if (checked) {
        current.add(key);
        return columns
          .map((col) => col.key)
          .filter((colKey) => current.has(colKey));
      }
      const hideableVisibleCount = hideableColumns.filter((col) =>
        current.has(col.key),
      ).length;
      if (hideableVisibleCount <= 1) return prev;
      current.delete(key);
      return columns
        .map((col) => col.key)
        .filter((colKey) => current.has(colKey));
    });
  };

  /* Search + Sort */
  const filtered = useMemo(() => {
    let items = [...data];

    if (search && searchKeys.length) {
      const q = search.toLowerCase();
      items = items.filter((item) =>
        searchKeys.some((key) => {
          const val = (item as any)[key];
          return val && String(val).toLowerCase().includes(q);
        })
      );
    }

    if (sortKey) {
      items.sort((a, b) => {
        const aVal = sortAccessor ? sortAccessor(a, sortKey) : (a as any)[sortKey];
        const bVal = sortAccessor ? sortAccessor(b, sortKey) : (b as any)[sortKey];
        let cmp = 0;
        if (aVal instanceof Date || bVal instanceof Date) {
          const aTime = aVal instanceof Date ? aVal.getTime() : new Date(String(aVal ?? "")).getTime();
          const bTime = bVal instanceof Date ? bVal.getTime() : new Date(String(bVal ?? "")).getTime();
          cmp = (Number.isFinite(aTime) ? aTime : 0) - (Number.isFinite(bTime) ? bTime : 0);
        } else if (typeof aVal === "number" || typeof bVal === "number") {
          cmp = Number(aVal ?? 0) - Number(bVal ?? 0);
        } else {
          cmp = String(aVal ?? "").localeCompare(String(bVal ?? ""), undefined, { numeric: true });
        }
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return items;
  }, [data, search, searchKeys, sortKey, sortDir]);

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = hidePagination
    ? filtered
    : filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
      return;
    }
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const toggleSort = (key: string) => {
    const next: { key: string; dir: "asc" | "desc" } =
      sortKey === key
        ? { key, dir: sortDir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" };
    if (onSortChange) onSortChange(next);
    else {
      setInternalSortKey(next.key);
      setInternalSortDir(next.dir);
    }
  };

  const allPageIds = paged.map((item) => item._id).filter(Boolean) as string[];
  const selectedSet = new Set(selectedIds ?? []);
  const allPageSelected = allPageIds.length > 0 && allPageIds.every((id) => selectedSet.has(id));
  const somePageSelected = allPageIds.some((id) => selectedSet.has(id));

  return (
    <Card className="border-border/60 overflow-hidden">
      <CardHeader className="border-b border-border/40 bg-muted/20 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-3">
            {searchKeys.length > 0 && (
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (onSearchValueChange) onSearchValueChange(value);
                    else setInternalSearch(value);
                    setPage(1);
                  }}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            )}
            {headerAction}
            {storageKey && hideableColumns.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Fields
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>Show columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {columns.map((col) => {
                    const disabled = col.hideable === false;
                    const checked = visibleColumnKeys.includes(col.key);
                    const hideableVisibleCount = hideableColumns.filter((c) =>
                      visibleColumnKeys.includes(c.key),
                    ).length;
                    const preventUncheck =
                      !disabled && checked && hideableVisibleCount <= 1;
                    return (
                      <DropdownMenuCheckboxItem
                        key={col.key}
                        checked={checked}
                        disabled={disabled || preventUncheck}
                        onCheckedChange={(value) =>
                          toggleColumnVisibility(col.key, Boolean(value))
                        }
                      >
                        {col.label}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                {onSelectedIdsChange && (
                  <TableHead className="w-10">
                    <Checkbox
                      checked={allPageSelected ? true : somePageSelected ? "indeterminate" : false}
                      onCheckedChange={(checked) => {
                        const next = new Set(selectedIds ?? []);
                        if (checked) allPageIds.forEach((id) => next.add(id));
                        else allPageIds.forEach((id) => next.delete(id));
                        onSelectedIdsChange(Array.from(next));
                      }}
                    />
                  </TableHead>
                )}
                {visibleColumns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={`whitespace-nowrap ${col.headerClassName ?? ""}`}
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => toggleSort(col.key)}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        {col.label}
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    ) : (
                      col.label
                    )}
                  </TableHead>
                ))}
                {actions && <TableHead className="text-right pr-6 w-[120px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length + (actions ? 1 : 0) + (onSelectedIdsChange ? 1 : 0)} className="text-center py-12 text-muted-foreground">
                    No results found
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((item, i) => (
                  <TableRow
                    key={item._id || i}
                    className={`group hover:bg-primary/2 ${rowClassName ? rowClassName(item) : ""}`}
                  >
                    {onSelectedIdsChange && (
                      <TableCell>
                        <Checkbox
                          checked={item._id ? selectedSet.has(item._id) : false}
                          onCheckedChange={(checked) => {
                            if (!item._id) return;
                            const next = new Set(selectedIds ?? []);
                            if (checked) next.add(item._id);
                            else next.delete(item._id);
                            onSelectedIdsChange(Array.from(next));
                          }}
                        />
                      </TableCell>
                    )}
                    {visibleColumns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={col.cellClassName}
                      >
                        {col.render ? col.render(item) : String((item as any)[col.key] ?? "")}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1">
                          {actions(item)}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {!hidePagination && (
          <div className="flex items-center justify-between border-t border-border/40 bg-muted/10 px-6 py-3">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{paged.length}</span> of{" "}
              <span className="font-semibold text-foreground">{filtered.length}</span>
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-7 px-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs px-2">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="h-7 px-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
