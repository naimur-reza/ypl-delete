"use client";

import React, { useState } from "react";
import Image from "next/image";
import { LayoutDashboard, Plus, Pencil, Trash2, MoveUp, MoveDown, Eye, EyeOff, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCrud } from "@/hooks/use-crud";
import { DataTable, Column } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { CrudModal } from "@/components/dashboard/crud-modal";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { SafeHtmlContent } from "@/components/ui/safe-html-content";
import { useAppForm } from "@/hooks/use-field-context";

interface Insight {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  order: number;
  isActive: boolean;
  publishedAt: string;
}

const categories = [
  "Career Advice",
  "Workplace Trends",
  "Workplace Culture",
  "Industry Insights",
];

const initialForm: Partial<Insight> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: "Super Admin",
  category: "Industry Insights",
  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  isActive: true,
  order: 0,
};

export default function InsightsDashboardPage() {
  const { items, isLoading, create, update, remove } = useCrud<Insight>("/api/insights");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Insight | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Insight | null>(null);

  const openAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEdit = (insight: Insight) => {
    setEditingItem(insight);
    setIsModalOpen(true);
  };

  const toggleActive = async (insight: Insight) => {
    await update(insight._id, { isActive: !insight.isActive });
  };

  const moveOrder = async (insight: Insight, direction: "up" | "down") => {
    const newOrder = direction === "up" ? insight.order - 1 : insight.order + 1;
    await update(insight._id, { order: newOrder });
  };

  const columns: Column<Insight>[] = [
    {
      key: "image",
      label: "Preview",
      render: (item) => (
        <div className="relative h-10 w-16 overflow-hidden rounded border border-border bg-muted">
          <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
        </div>
      ),
    },
    {
      key: "title",
      label: "Article Title",
      render: (item) => (
        <div className="flex flex-col gap-0.5 max-w-[300px]">
          <span className="text-sm font-bold truncate">{item.title}</span>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-[10px] h-4">{item.category}</Badge>
            <span className="text-[10px] text-muted-foreground">by {item.author}</span>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Switch checked={item.isActive} onCheckedChange={() => toggleActive(item)} />
          {item.isActive ? <Eye className="h-3 w-3 text-emerald-500" /> : <EyeOff className="h-3 w-3 text-muted-foreground" />}
        </div>
      ),
    },
    {
      key: "order",
      label: "Order",
      render: (item) => (
        <div className="flex items-center gap-1">
          <span className="w-4 text-center text-xs font-mono">{item.order}</span>
          <div className="flex flex-col">
            <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => moveOrder(item, "up")}>
              <MoveUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => moveOrder(item, "down")}>
              <MoveDown className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileText}
        title="Insights & Blog"
        description="Manage your articles, news, and career guidance"
        action={
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" /> New Article
          </Button>
        }
      />

      <DataTable
        title="All Articles"
        columns={columns}
        data={items}
        isLoading={isLoading}
        searchKeys={["title", "author", "category", "excerpt"]}
        actions={(item) => (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(item)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <CrudModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Insight" : "New Insight"}
        className="max-w-4xl"
      >
        <InsightForm
          editingItem={editingItem}
          onSuccess={() => setIsModalOpen(false)}
          create={create}
          update={update}
        />
      </CrudModal>

      <DeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => remove(deleteTarget!._id)}
        title="Delete Article?"
      />
    </div>
  );
}

function InsightForm({
  editingItem,
  onSuccess,
  create,
  update,
}: {
  editingItem: Insight | null;
  onSuccess: () => void;
  create: (data: any) => Promise<boolean>;
  update: (id: string, data: any) => Promise<boolean>;
}) {
  const form = useAppForm({
    defaultValues: editingItem || {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      author: "Super Admin",
      category: "Industry Insights",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      isActive: true,
      order: 0,
    },
    onSubmit: async ({ value }: { value: any }) => {
      const ok = editingItem?._id
        ? await update(editingItem._id, value)
        : await create(value);
      if (ok) onSuccess();
    },
  });

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <form.AppForm>
        <div className="grid grid-cols-2 gap-6">
          <form.AppField name="title">
            {(field: any) => (
              <field.Input 
                label="Title" 
                required 
                onChange={(e: any) => {
                  const val = e.target.value;
                  field.handleChange(val);
                  if (!editingItem) {
                    form.setFieldValue("slug", generateSlug(val));
                  }
                }}
              />
            )}
          </form.AppField>
          <form.AppField name="slug">
            {(field: any) => <field.Input label="Slug (URL)" required />}
          </form.AppField>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <form.AppField name="author">
            {(field: any) => <field.Input label="Author" required />}
          </form.AppField>
          <form.AppField name="category">
            {(field: any) => (
              <field.Select label="Category">
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>
          <form.AppField name="image">
            {(field: any) => <field.ImageUpload label="Banner Image" />}
          </form.AppField>
        </div>

        <form.AppField name="excerpt">
          {(field: any) => <field.Textarea label="Excerpt / Summary" required rows={2} />}
        </form.AppField>

        <div className=" ">
          <form.AppField name="content">
            {(field: any) => <field.RichText label="Full Article Content" />}
          </form.AppField>
 
        </div>

        <div className="flex items-center gap-6">
          <form.AppField name="isActive">
            {(field: any) => <field.Checkbox label="Published Status" />}
          </form.AppField>
          <form.AppField name="order">
            {(field: any) => (
              <field.Input
                label="Display Order"
                type="number"
                className="w-24"
                onChange={(e: any) => field.handleChange(Number(e.target.value))}
              />
            )}
          </form.AppField>
        </div>

        <form.Subscribe selector={(state: any) => state.isSubmitting}>
          {(isSubmitting: any) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                editingItem ? "Save Changes" : "Publish Article"
              )}
            </Button>
          )}
        </form.Subscribe>
      </form.AppForm>
    </form>
  );
}
