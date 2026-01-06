"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

interface Entity {
  id: string;
  name?: string;
  title?: string;
  slug?: string;
}

const entityTypes = [
  { value: "countries", label: "Countries" },
  { value: "destinations", label: "Destinations" },
  { value: "universities", label: "Universities" },
  { value: "events", label: "Events" },
  { value: "courses", label: "Courses" },
  { value: "scholarships", label: "Scholarships" },
  { value: "intakePages", label: "Intake Pages" },
];

const BulkAssignModal = ({
  isOpen,
  selectedFaqIds,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  selectedFaqIds: string[];
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const [operation, setOperation] = useState<"assign" | "remove">("assign");
  const [entityType, setEntityType] = useState<string>("");
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntityIds, setSelectedEntityIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch entities when entity type changes
  useEffect(() => {
    if (!entityType) {
      setEntities([]);
      return;
    }

    const fetchEntities = async () => {
      setLoading(true);
      try {
        const endpointMap: Record<string, string> = {
          countries: "/api/countries",
          destinations: "/api/destinations",
          universities: "/api/universities",
          events: "/api/events",
          courses: "/api/courses",
          scholarships: "/api/scholarships",
          intakePages: "/api/intake-pages",
        };

        const endpoint = endpointMap[entityType];
        if (!endpoint) {
          setEntities([]);
          return;
        }

        const response = await apiClient.get<{ data: Entity[] } | Entity[]>(
          endpoint,
          { limit: "1000" }
        );

        const data = Array.isArray(response) ? response : response.data || [];
        setEntities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching entities:", error);
        toast.error("Failed to load entities");
        setEntities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, [entityType]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setOperation("assign");
      setEntityType("");
      setSelectedEntityIds([]);
      setSearchTerm("");
    }
  }, [isOpen]);

  const filterEntities = (entities: Entity[], searchTerm: string) => {
    if (!searchTerm) return entities;
    const term = searchTerm.toLowerCase();
    return entities.filter(
      (e) =>
        e.name?.toLowerCase().includes(term) ||
        e.title?.toLowerCase().includes(term) ||
        e.slug?.toLowerCase().includes(term)
    );
  };

  const filteredEntities = filterEntities(entities, searchTerm);
  const allSelected =
    filteredEntities.length > 0 &&
    filteredEntities.every((e) => selectedEntityIds.includes(e.id));

  const handleSelectAll = () => {
    const filteredIds = filteredEntities.map((e) => e.id);
    if (allSelected) {
      setSelectedEntityIds(
        selectedEntityIds.filter((id) => !filteredIds.includes(id))
      );
    } else {
      setSelectedEntityIds([
        ...new Set([...selectedEntityIds, ...filteredIds]),
      ]);
    }
  };

  const handleSubmit = async () => {
    if (!entityType) {
      toast.error("Please select an entity type");
      return;
    }

    if (selectedEntityIds.length === 0) {
      toast.error("Please select at least one entity");
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiClient.patch("/api/faqs", {
        faqIds: selectedFaqIds,
        operation,
        entityType,
        entityIds: selectedEntityIds,
      });

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(
        `${operation === "assign" ? "Assigned" : "Removed"} ${
          selectedEntityIds.length
        } entity/entities from ${selectedFaqIds.length} FAQ(s)`
      );
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error performing bulk operation:", error);
      toast.error("Failed to perform bulk operation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={`Bulk ${operation === "assign" ? "Assign" : "Remove"} - ${
        selectedFaqIds.length
      } FAQ(s)`}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Operation</Label>
          <Select
            value={operation}
            onValueChange={(value) =>
              setOperation(value as "assign" | "remove")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="assign">Assign To</SelectItem>
              <SelectItem value="remove">Remove From</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Entity Type</Label>
          <Select value={entityType} onValueChange={setEntityType}>
            <SelectTrigger>
              <SelectValue placeholder="Select entity type" />
            </SelectTrigger>
            <SelectContent>
              {entityTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {entityType && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search entities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-9"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {selectedEntityIds.length} selected
                </Badge>
                {filteredEntities.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({filteredEntities.length}{" "}
                    {filteredEntities.length === 1 ? "item" : "items"})
                  </span>
                )}
              </div>
              {filteredEntities.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-7 text-xs"
                >
                  {allSelected ? "Clear All" : "Select All"}
                </Button>
              )}
            </div>

            <div className="h-64 border rounded-md p-3 overflow-y-auto">
              {loading ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Loading...
                </p>
              ) : filteredEntities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {searchTerm ? "No results found" : "No items available"}
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {filteredEntities.map((entity) => (
                    <div
                      key={entity.id}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={`bulk-${entity.id}`}
                        checked={selectedEntityIds.includes(entity.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedEntityIds([
                              ...selectedEntityIds,
                              entity.id,
                            ]);
                          } else {
                            setSelectedEntityIds(
                              selectedEntityIds.filter((id) => id !== entity.id)
                            );
                          }
                        }}
                      />
                      <Label
                        htmlFor={`bulk-${entity.id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {entity.title || entity.name || entity.slug}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              !entityType || selectedEntityIds.length === 0 || submitting
            }
          >
            {submitting
              ? "Processing..."
              : `${operation === "assign" ? "Assign" : "Remove"}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BulkAssignModal;
