"use client";

import { Settings, Save, Loader2, Globe, Facebook, Linkedin, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/use-field-context";
import { PageHeader } from "@/components/dashboard/page-header";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Setting {
  _id?: string;
  siteName: string;
  email: string;
  phone: string;
  address: string;
  footerDescription: string;
  socialLinks: {
    platform: string;
    url: string;
  }[];
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<Setting | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setInitialData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch settings:", err);
        setIsLoading(false);
      });
  }, []);

  const form = useAppForm({
    defaultValues: initialData || {
      siteName: "YPL",
      email: "info@ypl.com",
      phone: "+44 (0) 20 1234 5678",
      address: "123 Business Street, London, EC1A 1BB, United Kingdom",
      footerDescription: "Supporting the full talent lifecycle with expert recruitment and career management services.",
      socialLinks: [
        { platform: "LinkedIn", url: "" },
        { platform: "Twitter", url: "" },
        { platform: "Facebook", url: "" },
        { platform: "Instagram", url: "" },
      ],
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });

        if (res.ok) {
          toast.success("Settings updated successfully!");
        } else {
          toast.error("Failed to update settings.");
        }
      } catch (error) {
        toast.error("An error occurred.");
      }
    },
  });

  // Re-sync form when initialData is loaded
  useEffect(() => {
    if (initialData) {
      form.setFieldValue("siteName", initialData.siteName);
      form.setFieldValue("email", initialData.email);
      form.setFieldValue("phone", initialData.phone);
      form.setFieldValue("address", initialData.address);
      form.setFieldValue("footerDescription", initialData.footerDescription);
      form.setFieldValue("socialLinks", initialData.socialLinks);
    }
  }, [initialData]);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-20">
      <PageHeader
        icon={Settings}
        title="Global Settings"
        description="Manage site-wide configurations and footer content"
      />

      <div className="grid gap-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <form.AppForm>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" /> Basic Information
              </h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <form.AppField name="siteName">
                  {(field: any) => <field.Input label="Site Name" required />}
                </form.AppField>
                <form.AppField name="email">
                  {(field: any) => <field.Input label="Contact Email" type="email" required />}
                </form.AppField>
                <form.AppField name="phone">
                  {(field: any) => <field.Input label="Contact Phone" required />}
                </form.AppField>
              </div>
              <div className="mt-6">
                <form.AppField name="address">
                  {(field: any) => <field.Textarea label="Physical Address" required rows={3} />}
                </form.AppField>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" /> Footer Content
              </h3>
              <form.AppField name="footerDescription">
                {(field: any) => <field.Textarea label="Footer Description" required rows={3} />}
              </form.AppField>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" /> Social Links
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Subscribe selector={(state: any) => state.values.socialLinks}>
                  {(socialLinks: any[]) => (
                    <>
                      {(socialLinks || []).map((link, index) => (
                        <div key={link.platform} className="space-y-2">
                          <label className="text-sm font-medium">{link.platform} URL</label>
                          <form.AppField name={`socialLinks[${index}].url`}>
                            {(field: any) => (
                              <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                  {link.platform === "LinkedIn" && <Linkedin className="h-4 w-4" />}
                                  {link.platform === "Twitter" && <Twitter className="h-4 w-4" />}
                                  {link.platform === "Facebook" && <Facebook className="h-4 w-4" />}
                                  {link.platform === "Instagram" && <Instagram className="h-4 w-4" />}
                                </div>
                                <input
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  placeholder={`https://${link.platform.toLowerCase()}.com/...`}
                                  value={field.state.value}
                                  onChange={(e) => field.handleChange(e.target.value)}
                                  onBlur={field.handleBlur}
                                />
                              </div>
                            )}
                          </form.AppField>
                        </div>
                      ))}
                    </>
                  )}
                </form.Subscribe>
              </div>
            </div>

            <div className="flex justify-end">
              <form.Subscribe selector={(state: any) => state.isSubmitting}>
                {(isSubmitting: any) => (
                  <Button type="submit" disabled={isSubmitting} className="gap-2 px-8">
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </form.AppForm>
        </form>
      </div>
    </div>
  );
}
