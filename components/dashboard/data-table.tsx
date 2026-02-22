"use client";

import { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Loader2 } from "lucide-react";

/* ───────── Column definition ───────── */
export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
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
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

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
        const aVal = (a as any)[sortKey] ?? "";
        const bVal = (b as any)[sortKey] ?? "";
        const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return items;
  }, [data, search, searchKeys, sortKey, sortDir]);

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

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
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            )}
            {headerAction}
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
                {columns.map((col) => (
                  <TableHead key={col.key} className="whitespace-nowrap">
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
                  <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-12 text-muted-foreground">
                    No results found
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((item, i) => (
                  <TableRow key={item._id || i} className="group hover:bg-primary/[0.02]">
                    {columns.map((col) => (
                      <TableCell key={col.key}>
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

        {/* Footer */}
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
      </CardContent>
    </Card>
  );
}
