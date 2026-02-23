"use client";

import { LayoutDashboard, Plus, Pencil, Trash2, MoveUp, MoveDown, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useCrud } from "@/hooks/use-crud";
import { DataTable, Column } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { CrudModal } from "@/components/dashboard/crud-modal";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { useState } from "react";
import Image from "next/image";
import { useAppForm } from "@/hooks/use-field-context";
import { SafeHtmlContent } from "@/components/ui/safe-html-content";

interface Hero {
  _id: string;
  badgeText: string;
  title: string;
  highlightText: string;
  description: string;
  image: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  order: number;
  isActive: boolean;
}

export default function HeroDashboardPage() {
  const { items, isLoading, create, update, remove } = useCrud<Hero>("/api/hero");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Hero | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Hero | null>(null);

  const openAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEdit = (hero: Hero) => {
    setEditingItem(hero);
    setIsModalOpen(true);
  };

  const toggleActive = async (hero: Hero) => {
    await update(hero._id, { isActive: !hero.isActive });
  };

  const moveOrder = async (hero: Hero, direction: "up" | "down") => {
    const newOrder = direction === "up" ? hero.order - 1 : hero.order + 1;
    await update(hero._id, { order: newOrder });
  };

  const columns: Column<Hero>[] = [
    {
      key: "image",
      label: "Preview",
      render: (item) => (
        <div className="relative h-12 w-20 overflow-hidden rounded border border-border bg-muted">
          <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
        </div>
      ),
    },
    {
      key: "title",
      label: "Title & Badge",
      render: (item) => (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold truncate max-w-[200px]">{item.title} {item.highlightText}</span>
          <Badge variant="secondary" className="w-fit text-[10px] px-1 h-4">{item.badgeText}</Badge>
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
        icon={LayoutDashboard}
        title="Hero Slider"
        description="Manage your dynamic homepage hero slides"
        action={
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" /> Add Slide
          </Button>
        }
      />

      <DataTable
        title="Homepage Slides"
        columns={columns}
        data={items}
        isLoading={isLoading}
        searchKeys={["title", "badgeText", "description"]}
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
        title={editingItem ? "Edit Hero Slide" : "New Hero Slide"}
        className="max-w-4xl"
      >
        <HeroForm
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
        title="Delete Slide?"
      />
    </div>
  );
}

function HeroForm({
  editingItem,
  onSuccess,
  create,
  update,
}: {
  editingItem: Hero | null;
  onSuccess: () => void;
  create: (data: any) => Promise<boolean>;
  update: (id: string, data: any) => Promise<boolean>;
}) {
  const form = useAppForm({
    defaultValues: editingItem || {
      badgeText: "Recruitment Partner",
      title: "Building Teams That",
      highlightText: "Drive Success",
      description: "We connect exceptional talent with forward-thinking organizations.",
      image: "",
      primaryBtnText: "Browse Jobs",
      primaryBtnLink: "/jobs",
      secondaryBtnText: "Contact Us",
      secondaryBtnLink: "/contact",
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.AppForm>
        <div className="grid grid-cols-2 gap-4">
          <form.AppField name="badgeText">
            {(field: any) => <field.Input label="Badge Text" required />}
          </form.AppField>
          <form.AppField name="title">
            {(field: any) => <field.Input label="Main Title" required />}
          </form.AppField>
        </div>

        <form.AppField name="highlightText">
          {(field: any) => <field.Input label="Highlight Text (Colored)" required />}
        </form.AppField>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <form.AppField name="description">
            {(field: any) => <field.RichText label="Description" required />}
          </form.AppField>
          <div className="space-y-2">
            <span className="text-sm font-medium">Live Preview</span>
            <div className="rounded-md border border-input p-4 min-h-[150px] max-h-[200px] overflow-y-auto bg-muted/10">
              <form.Subscribe selector={(state: any) => state.values.description}>
                {(desc: string) => <SafeHtmlContent content={desc} />}
              </form.Subscribe>
            </div>
          </div>
        </div>

        <form.AppField name="image">
          {(field: any) => <field.ImageUpload label="Background Image" />}
        </form.AppField>

        <div className="grid grid-cols-2 gap-4">
          <form.AppField name="primaryBtnText">
            {(field: any) => <field.Input label="Primary Button Text" />}
          </form.AppField>
          <form.AppField name="primaryBtnLink">
            {(field: any) => <field.Input label="Primary Button Link" />}
          </form.AppField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <form.AppField name="secondaryBtnText">
            {(field: any) => <field.Input label="Secondary Button Text" />}
          </form.AppField>
          <form.AppField name="secondaryBtnLink">
            {(field: any) => <field.Input label="Secondary Button Link" />}
          </form.AppField>
        </div>

        <div className="flex items-center gap-6">
          <form.AppField name="isActive">
            {(field: any) => <field.Checkbox label="Active Status" />}
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
                editingItem ? "Save Changes" : "Create Slide"
              )}
            </Button>
          )}
        </form.Subscribe>
      </form.AppForm>
    </form>
  );
}
