"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MultiSelect from "@/components/ui/multi-select";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { QuickLink } from "@/schemas/settings";

interface Destination {
  id: string;
  name: string;
}

interface FooterSettings {
  footerDestinations?: string[] | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  contactAddress?: string | null;
  quickLinks?: QuickLink[] | null;
  socialFacebook?: string | null;
  socialYoutube?: string | null;
  socialLinkedin?: string | null;
  socialTwitter?: string | null;
  socialInstagram?: string | null;
  privacyPolicyUrl?: string | null;
  termsOfServiceUrl?: string | null;
  cookiePolicyUrl?: string | null;
  footerDescription?: string | null;
}

export default function FooterSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  const [settings, setSettings] = useState<FooterSettings>({
    footerDestinations: [],
    contactPhone: "",
    contactEmail: "",
    contactAddress: "",
    quickLinks: [],
    socialFacebook: "",
    socialYoutube: "",
    socialLinkedin: "",
    socialTwitter: "",
    socialInstagram: "",
    privacyPolicyUrl: "",
    termsOfServiceUrl: "",
    cookiePolicyUrl: "",
    footerDescription: "",
  });

  // Fetch destinations and settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch destinations
        const destResponse = await fetch("/api/destinations");
        if (destResponse.ok) {
          const destData = await destResponse.json();
          const dests = Array.isArray(destData.data)
            ? destData.data
            : destData.data || [];
          setDestinations(
            dests.map((d: { id: string; name: string }) => ({
              id: d.id,
              name: d.name,
            }))
          );
        }

        // Fetch footer settings
        const settingsResponse = await fetch("/api/settings?key=footer");
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          if (settingsData.data) {
            setSettings({
              footerDestinations:
                (settingsData.data.footerDestinations as string[]) || [],
              contactPhone: settingsData.data.contactPhone || "",
              contactEmail: settingsData.data.contactEmail || "",
              contactAddress: settingsData.data.contactAddress || "",
              quickLinks: (settingsData.data.quickLinks as QuickLink[]) || [],
              socialFacebook: settingsData.data.socialFacebook || "",
              socialYoutube: settingsData.data.socialYoutube || "",
              socialLinkedin: settingsData.data.socialLinkedin || "",
              socialTwitter: settingsData.data.socialTwitter || "",
              socialInstagram: settingsData.data.socialInstagram || "",
              privacyPolicyUrl: settingsData.data.privacyPolicyUrl || "",
              termsOfServiceUrl: settingsData.data.termsOfServiceUrl || "",
              cookiePolicyUrl: settingsData.data.cookiePolicyUrl || "",
              footerDescription: settingsData.data.footerDescription || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching footer settings:", error);
        toast.error("Failed to load footer settings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "footer",
          ...settings,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save settings");
      }

      toast.success("Footer settings saved successfully");
    } catch (error: unknown) {
      console.error("Error saving footer settings:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save footer settings";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const addQuickLink = () => {
    setSettings({
      ...settings,
      quickLinks: [...(settings.quickLinks || []), { label: "", url: "" }],
    });
  };

  const removeQuickLink = (index: number) => {
    setSettings({
      ...settings,
      quickLinks: settings.quickLinks?.filter((_, i) => i !== index) || [],
    });
  };

  const updateQuickLink = (
    index: number,
    field: keyof QuickLink,
    value: string
  ) => {
    const updated = [...(settings.quickLinks || [])];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, quickLinks: updated });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const destinationOptions = destinations.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  return (
    <div className="space-y-6">
      {/* Study Destinations */}
      <Card>
        <CardHeader>
          <CardTitle>Study Destinations</CardTitle>
          <CardDescription>
            Select which destinations to display in the footer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Destinations</Label>
            <MultiSelect
              options={destinationOptions}
              value={settings.footerDestinations || []}
              onChange={(value) =>
                setSettings({ ...settings, footerDestinations: value })
              }
              placeholder="Select destinations..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Update contact details displayed in the footer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Phone</Label>
            <Input
              id="contactPhone"
              value={settings.contactPhone || ""}
              onChange={(e) =>
                setSettings({ ...settings, contactPhone: e.target.value })
              }
              placeholder="+44 (0)203 488 1195"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={settings.contactEmail || ""}
              onChange={(e) =>
                setSettings({ ...settings, contactEmail: e.target.value })
              }
              placeholder="info@nwceducation.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactAddress">Address</Label>
            <Textarea
              id="contactAddress"
              value={settings.contactAddress || ""}
              onChange={(e) =>
                setSettings({ ...settings, contactAddress: e.target.value })
              }
              placeholder="Unit 1, Sky View Tower,&#10;London E15 2GR, UK"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>
            Manage quick navigation links in the footer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.quickLinks?.map((link, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input
                  placeholder="Label"
                  value={link.label}
                  onChange={(e) =>
                    updateQuickLink(index, "label", e.target.value)
                  }
                />
                <Input
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) =>
                    updateQuickLink(index, "url", e.target.value)
                  }
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeQuickLink(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addQuickLink}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Quick Link
          </Button>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>Add your social media profile URLs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="socialFacebook">Facebook URL</Label>
            <Input
              id="socialFacebook"
              type="url"
              value={settings.socialFacebook || ""}
              onChange={(e) =>
                setSettings({ ...settings, socialFacebook: e.target.value })
              }
              placeholder="https://facebook.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="socialYoutube">YouTube URL</Label>
            <Input
              id="socialYoutube"
              type="url"
              value={settings.socialYoutube || ""}
              onChange={(e) =>
                setSettings({ ...settings, socialYoutube: e.target.value })
              }
              placeholder="https://youtube.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="socialLinkedin">LinkedIn URL</Label>
            <Input
              id="socialLinkedin"
              type="url"
              value={settings.socialLinkedin || ""}
              onChange={(e) =>
                setSettings({ ...settings, socialLinkedin: e.target.value })
              }
              placeholder="https://linkedin.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="socialTwitter">Twitter/X URL</Label>
            <Input
              id="socialTwitter"
              type="url"
              value={settings.socialTwitter || ""}
              onChange={(e) =>
                setSettings({ ...settings, socialTwitter: e.target.value })
              }
              placeholder="https://twitter.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="socialInstagram">Instagram URL</Label>
            <Input
              id="socialInstagram"
              type="url"
              value={settings.socialInstagram || ""}
              onChange={(e) =>
                setSettings({ ...settings, socialInstagram: e.target.value })
              }
              placeholder="https://instagram.com/..."
            />
          </div>
        </CardContent>
      </Card>

 

      {/* Footer Description */}
      <Card>
        <CardHeader>
          <CardTitle>Footer Description</CardTitle>
          <CardDescription>
            Update the description text shown in the footer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="footerDescription">Description</Label>
            <Textarea
              id="footerDescription"
              value={settings.footerDescription || ""}
              onChange={(e) =>
                setSettings({ ...settings, footerDescription: e.target.value })
              }
              placeholder="Empowering students to achieve their global education dreams..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Footer Settings"
          )}
        </Button>
      </div>
    </div>
  );
}
