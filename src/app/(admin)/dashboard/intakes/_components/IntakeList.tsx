"use client";

import { useState } from "react";
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
  Calendar,
} from "lucide-react";
import { SearchParams } from "@/types";
import { formatDate } from "@/lib/utils";

interface IntakeListProps {
  searchParams: SearchParams;
}

// Mock data - replace with actual API call
const mockIntakes = [
  {
    id: "1",
    title: "May Intake 2024",
    destination: { name: "United Kingdom", slug: "uk" },
    intake: "MAY",
    country: null,
    isGlobal: true,
    status: "ACTIVE",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    _count: { faqs: 8 },
  },
  {
    id: "2",
    title: "September Intake 2024",
    destination: { name: "United Kingdom", slug: "uk" },
    intake: "SEPTEMBER",
    country: { name: "Bangladesh", slug: "bangladesh" },
    isGlobal: false,
    status: "DRAFT",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-10"),
    _count: { faqs: 12 },
  },
  {
    id: "3",
    title: "January Intake 2025",
    destination: { name: "United States", slug: "usa" },
    intake: "JANUARY",
    country: null,
    isGlobal: true,
    status: "ACTIVE",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-05"),
    _count: { faqs: 6 },
  },
];

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(mockIntakes.map((item) => item.id));
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
  };

  const handleDelete = (id: string) => {
    // Handle delete logic
  };

  const handleBulkAction = (action: string) => {
    // Handle bulk actions
  };

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
                  checked={selectedItems.length === mockIntakes.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Intake</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>FAQs</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockIntakes.map((intake) => (
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
                  <div>
                    <div className="font-medium text-gray-900">
                      {intake.title}
                    </div>
                    <div className="text-sm text-gray-500">ID: {intake.id}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>{intake.destination.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getIntakeColor(intake.intake)}>
                    {intake.intake}
                  </Badge>
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
                        <span className="text-sm">{intake.country?.name}</span>
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{intake._count.faqs}</span>
                    <span className="text-xs text-gray-500">FAQs</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">
                    {formatDate(intake.updatedAt)}
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
                        <Link href={`/admin/dashboard/intakes/${intake.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/study-in-${intake.destination.slug}/${intake.intake.toLowerCase()}`}
                          target="_blank"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDuplicate(intake.id)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
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
          Showing 1-{mockIntakes.length} of {mockIntakes.length} results
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
