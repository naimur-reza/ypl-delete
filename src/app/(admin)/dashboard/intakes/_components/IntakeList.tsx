"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Copy,
  Eye,
  Trash2,
  Globe,
  MapPin,
} from "lucide-react";
import { SearchParams } from "@/types";
import { formatDate } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

interface IntakeListProps {
  searchParams: SearchParams;
}

interface IntakeItem {
  id: string;
  heroTitle?: string;
  intake?: string;
  destination?: { name: string; slug: string };
  countries?: { country: { name: string; slug: string } }[];
  isGlobal?: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  intakeSeason?: { title: string };
  _count?: { faqs: number };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800 border-green-200";
    case "DRAFT":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getIntakeColor = (intake: string) => {
  switch (intake) {
    case "JANUARY":
      return "bg-blue-100 text-blue-800";
    case "MAY":
      return "bg-yellow-100 text-yellow-800";
    case "SEPTEMBER":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function IntakeList({ searchParams }: IntakeListProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [intakes, setIntakes] = useState<IntakeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchIntakes = async () => {
      setLoading(true);
      try {
        const queryParams: Record<string, string> = {
          limit: "100", // Fetch more items
        };
        
        // Add search params to query
        if (searchParams.status) queryParams.status = searchParams.status;
        if (searchParams.destination) queryParams.destinationId = searchParams.destination;
        if (searchParams.intake) queryParams.intake = searchParams.intake;
        if (searchParams.search) queryParams.search = searchParams.search;

        const res = await apiClient.get<{ data: IntakeItem[]; pagination?: any }>("/api/intake-pages", queryParams);
        if (res.data) {
          const arr = Array.isArray(res.data) ? res.data : (res.data as any).data || [];
          setIntakes(arr);
          if ((res.data as any).pagination) {
            setPagination((res.data as any).pagination);
          }
        }
      } catch (e) {
        console.error("Failed to fetch intakes", e);
        toast.error("Failed to load intake pages");
      } finally {
        setLoading(false);
      }
    };

    fetchIntakes();
  }, [searchParams]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(intakes.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    }
  };

  const handleDuplicate = (id: string) => {
    // Handle duplicate logic
    toast.info("Duplicate feature coming soon");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this intake?")) return;
    
    try {
      await apiClient.delete("/api/intake-pages", { id });
      setIntakes(intakes.filter((i) => i.id !== id));
      toast.success("Intake deleted successfully");
    } catch (e: any) {
      console.error("Delete failed", e);
      toast.error(e.message || "Failed to delete intake");
    }
  };

  const handleBulkAction = async (action: string) => {
    if (action === "delete") {
      if (!confirm(`Are you sure you want to delete ${selectedItems.length} intake(s)? This action cannot be undone.`)) {
        return;
      }
      
      try {
        // Delete each selected item
        await Promise.all(
          selectedItems.map((id) => apiClient.delete("/api/intake-pages", { id }))
        );
        
        // Remove deleted items from the list
        setIntakes(intakes.filter((i) => !selectedItems.includes(i.id)));
        setSelectedItems([]);
        toast.success(`${selectedItems.length} intake(s) deleted successfully`);
      } catch (e: any) {
        console.error("Bulk delete failed", e);
        toast.error(e.message || "Failed to delete some intakes");
      }
    } else {
      toast.info(`Bulk ${action} feature coming soon`);
    }
  };

  const getIntakeTitle = (intake: IntakeItem) => {
    if (intake.intakeSeason?.title) return intake.intakeSeason.title;
    if (intake.heroTitle) return intake.heroTitle;
    if (intake.intake && intake.destination?.name) {
      return `${intake.intake} - ${intake.destination.name}`;
    }
    return "Untitled Intake";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-muted-foreground">
        Loading intake pages...
      </div>
    );
  }

  if (intakes.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-muted-foreground">
        No intake pages found. Create your first one!
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <span className="text-sm text-gray-600">
            {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""}{" "}
            selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("publish")}
            >
              Publish
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("unpublish")}
            >
              Unpublish
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleBulkAction("delete")}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={selectedItems.length === intakes.length && intakes.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Intake</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {intakes.map((intake) => (
              <TableRow key={intake.id} className="hover:bg-gray-50">
                <TableCell>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedItems.includes(intake.id)}
                    onChange={(e) =>
                      handleSelectItem(intake.id, e.target.checked)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium text-gray-900">
                    {getIntakeTitle(intake)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>{intake.destination?.name || "N/A"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {intake.intake && (
                    <Badge className={getIntakeColor(intake.intake)}>
                      {intake.intake}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {intake.isGlobal ? (
                      <>
                        <Globe className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Global</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4 text-green-500" />
                        <span className="text-sm">
                          {intake.countries?.[0]?.country?.name || "Country-Specific"}
                        </span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusColor(intake.status)}
                  >
                    {intake.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">
                    {formatDate(new Date(intake.updatedAt))}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/intakes/${intake.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      {intake.destination?.slug && intake.intake && (
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${intake.destination.slug}/${intake.intake.toLowerCase()}`}
                            target="_blank"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </Link>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(intake.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing {intakes.length} results
        </div>
      </div>
    </div>
  );
}
