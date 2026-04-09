"use client";

import { useState, use } from "react";
import { Briefcase, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCrud } from "@/hooks/use-crud";
import { PageHeader } from "@/components/dashboard/page-header";
import { useAppForm } from "@/hooks/use-field-context";
import Link from "next/link";
import { toast } from "sonner";
import { MarkdownContent } from "@/components/ui/markdown-content";

interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  icon: string;
  features: string[];
  image: string;
  order: number;
  isActive: boolean;
}

export default function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  // Include inactive services so details work even for disabled items.
  const { items, update, isLoading } = useCrud<Service>("/api/services?includeInactive=1");
  const service = items?.find((s) => s._id === id);

  const form = useAppForm({
    defaultValues: service || {
      title: "",
      slug: "",
      description: "",
      content: "",
      icon: "briefcase",
      features: [],
      image: "",
      isActive: true,
      order: 0,
    },
    onSubmit: async ({ value }: { value: any }) => {
      const ok = await update(id, value);
      if (ok) toast.success("Service updated successfully");
    },
  });

  if (isLoading) return <div className="p-8">Loading service...</div>;
  if (!service && !isLoading) return <div className="p-8">Service not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/services"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => form.handleSubmit()}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <PageHeader
        icon={Briefcase}
        title={service?.title || "Service Details"}
        description={`Managing ${service?.title} details and deep content`}
      />

      <div className="rounded-xl border bg-card p-6 shadow-xs">
        <h3 className="mb-1 text-lg font-semibold">Content Editor</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Write detailed service content using Markdown (headings, lists, links, and bold text).
        </p>
        <form.AppForm>
          <form.AppField name="content">
            {(field: any) => (
              <field.Textarea
                label="Detailed Service Content" 
                placeholder="Write detailed service information here..."
                rows={14}
              />
            )}
          </form.AppField>
        </form.AppForm>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-xs">
        <h3 className="mb-1 text-lg font-semibold">Live Preview</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Preview of the Markdown-rendered content.
        </p>
        <div className="min-h-[200px] border rounded-md p-6 bg-muted/5">
          <form.Subscribe selector={(state: any) => state.values.content}>
            {(content: string) => (
              <MarkdownContent
                content={content || "_Start writing markdown to see preview._"}
              />
            )}
          </form.Subscribe>
        </div>
      </div>
    </div>
  );
}
