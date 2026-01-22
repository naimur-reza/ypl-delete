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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { toast } from "sonner";
import { Loader2, FileText } from "lucide-react";

interface LegalPageData {
  id: string;
  type: "PRIVACY_POLICY" | "TERMS_AND_CONDITIONS";
  title: string;
  subtitle: string | null;
  content: string | null;
  updatedAt: string;
}

interface LegalPagesResponse {
  privacyPolicy: LegalPageData | null;
  termsAndConditions: LegalPageData | null;
}

export default function LegalSettings() {
  const [loading, setLoading] = useState(true);
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const [savingTerms, setSavingTerms] = useState(false);

  const [privacy, setPrivacy] = useState({
    title: "Privacy Policy",
    subtitle: "",
    content: "",
  });
  const [terms, setTerms] = useState({
    title: "Terms and Conditions",
    subtitle: "",
    content: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/legal-pages");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        const data = json as LegalPagesResponse;

        if (data.privacyPolicy) {
          setPrivacy({
            title: data.privacyPolicy.title ?? "Privacy Policy",
            subtitle: data.privacyPolicy.subtitle ?? "",
            content: data.privacyPolicy.content ?? "",
          });
        }
        if (data.termsAndConditions) {
          setTerms({
            title: data.termsAndConditions.title ?? "Terms and Conditions",
            subtitle: data.termsAndConditions.subtitle ?? "",
            content: data.termsAndConditions.content ?? "",
          });
        }
      } catch (e) {
        console.error("Error fetching legal pages:", e);
        toast.error("Failed to load legal pages");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const savePrivacy = async () => {
    try {
      setSavingPrivacy(true);
      const res = await fetch("/api/legal-pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "PRIVACY_POLICY",
          title: privacy.title,
          subtitle: privacy.subtitle || null,
          content: privacy.content || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save");
      }
      toast.success("Privacy Policy saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save Privacy Policy");
    } finally {
      setSavingPrivacy(false);
    }
  };

  const saveTerms = async () => {
    try {
      setSavingTerms(true);
      const res = await fetch("/api/legal-pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "TERMS_AND_CONDITIONS",
          title: terms.title,
          subtitle: terms.subtitle || null,
          content: terms.content || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save");
      }
      toast.success("Terms and Conditions saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save Terms and Conditions");
    } finally {
      setSavingTerms(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Privacy Policy
          </CardTitle>
          <CardDescription>
            Edit the privacy policy page. Shown at /privacy-policy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="privacy-title">Title</Label>
            <Input
              id="privacy-title"
              value={privacy.title}
              onChange={(e) =>
                setPrivacy((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Privacy Policy"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="privacy-subtitle">Subtitle</Label>
            <Input
              id="privacy-subtitle"
              value={privacy.subtitle}
              onChange={(e) =>
                setPrivacy((p) => ({ ...p, subtitle: e.target.value }))
              }
              placeholder="Optional subtitle"
            />
          </div>
          <div className="space-y-2">
            <RichTextEditor
              label="Content"
              value={privacy.content}
              onChange={(v) => setPrivacy((p) => ({ ...p, content: v }))}
              placeholder="Enter privacy policy content..."
              editorKey="legal-privacy"
            />
          </div>
          <Button onClick={savePrivacy} disabled={savingPrivacy}>
            {savingPrivacy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Privacy Policy"
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Terms and Conditions
          </CardTitle>
          <CardDescription>
            Edit the terms and conditions page. Shown at /terms-and-conditions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="terms-title">Title</Label>
            <Input
              id="terms-title"
              value={terms.title}
              onChange={(e) =>
                setTerms((t) => ({ ...t, title: e.target.value }))
              }
              placeholder="Terms and Conditions"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="terms-subtitle">Subtitle</Label>
            <Input
              id="terms-subtitle"
              value={terms.subtitle}
              onChange={(e) =>
                setTerms((t) => ({ ...t, subtitle: e.target.value }))
              }
              placeholder="Optional subtitle"
            />
          </div>
          <div className="space-y-2">
            <RichTextEditor
              label="Content"
              value={terms.content}
              onChange={(v) => setTerms((t) => ({ ...t, content: v }))}
              placeholder="Enter terms and conditions content..."
              editorKey="legal-terms"
            />
          </div>
          <Button onClick={saveTerms} disabled={savingTerms}>
            {savingTerms ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Terms and Conditions"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
