/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { apiClient } from "@/lib/api-client";
import { useAppForm } from "@/hooks/hooks";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi } from "@/lib/api-client";
import { SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Plus,
  Trash2,
  GripVertical,
  Upload,
  Image as ImageIcon,
  Video,
  ExternalLink,
} from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

// Available icons for benefits
const AVAILABLE_ICONS = [
  { value: "GraduationCap", label: "Graduation Cap" },
  { value: "Clock", label: "Clock" },
  { value: "DollarSign", label: "Dollar Sign" },
  { value: "Users", label: "Users" },
  { value: "Star", label: "Star" },
  { value: "Award", label: "Award" },
  { value: "BookOpen", label: "Book Open" },
  { value: "Target", label: "Target" },
  { value: "CheckCircle", label: "Check Circle" },
  { value: "Briefcase", label: "Briefcase" },
  { value: "Globe", label: "Globe" },
  { value: "Heart", label: "Heart" },
];

// Helper function to check if URL is a video
function isVideoUrl(url: string): boolean {
  return (
    url.toLowerCase().endsWith(".mp4") ||
    url.toLowerCase().endsWith(".webm") ||
    url.toLowerCase().endsWith(".mov")
  );
}

// Benefit item type
interface BenefitItem {
  id?: string;
  title: string;
  description: string;
  icon: string;
}

// How We Help item type
interface HelpStepItem {
  title: string;
  description: string;
}

const schema = z.object({
  // Core Fields
  destinationId: z.string().min(1, "Destination is required"),
  intake: z
    .enum(["JANUARY", "MAY", "SEPTEMBER"])
    .describe("Intake is required"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "DRAFT"]).default("DRAFT"),

  // Country/Global
  countryId: z.string().optional().nullable(),
  isGlobal: z.boolean().default(false),

  // Hero Section
  heroTitle: z.string().optional().nullable(),
  heroSubtitle: z.string().optional().nullable(),
  heroMedia: z.string().optional().nullable(),
  heroCTALabel: z.string().optional().nullable(),
  heroCTAUrl: z.string().optional().nullable(),

  // Why Choose Section
  whyChooseTitle: z.string().optional().nullable(),
  whyChooseDescription: z.string().optional().nullable(),

  // Timeline - just the deadline
  targetDate: z.string().optional().nullable(),
  timelineEnabled: z.boolean().default(true),

  // How We Help
  howWeHelpEnabled: z.boolean().default(true),

  // SEO
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  metaKeywords: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

const api = createEntityApi<{ id: string }>("/api/intake-pages");

interface IntakePageFormProps {
  initialData?: { id: string } & Partial<FormData> & {
      intakePageBenefits?: BenefitItem[];
      howWeHelpJson?: HelpStepItem[];
    };
  onSuccess?: () => void;
}

export function IntakePageForm({
  initialData,
  onSuccess,
}: IntakePageFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [destinations, setDestinations] = useState<
    { id: string; name: string }[]
  >([]);
  const [countries, setCountries] = useState<{ id: string; name: string }[]>(
    [],
  );

  // Benefits state (Why Choose section)
  const [benefits, setBenefits] = useState<BenefitItem[]>(() => {
    if (
      initialData?.intakePageBenefits &&
      initialData.intakePageBenefits.length > 0
    ) {
      return initialData.intakePageBenefits;
    }
    return [];
  });

  // How We Help steps state
  const [helpSteps, setHelpSteps] = useState<HelpStepItem[]>(() => {
    if (
      initialData?.howWeHelpJson &&
      Array.isArray(initialData.howWeHelpJson)
    ) {
      return initialData.howWeHelpJson;
    }
    return [
      {
        title: "Free Consultation",
        description:
          "Get personalized guidance on course selection and university options",
      },
      {
        title: "Application Support",
        description:
          "Complete assistance with your university applications and documents",
      },
      {
        title: "Scholarship Guidance",
        description:
          "Help identify and apply for relevant scholarship programs",
      },
      {
        title: "Visa Assistance",
        description: "Expert support throughout the visa application process",
      },
    ];
  });

  useEffect(() => {
    const load = async () => {
      try {
        // Load destinations
        const dRes = await apiClient.get<{
          data: { id: string; name: string }[];
        }>("/api/destinations", { limit: "1000" });
        if (dRes.data) {
          const arr = Array.isArray(dRes.data)
            ? (dRes.data as any)
            : (dRes.data as any).data || [];
          setDestinations(arr);
        }

        // Load countries
        const cRes = await apiClient.get<{
          data: { id: string; name: string }[];
        }>("/api/countries", { limit: "1000" });
        if (cRes.data) {
          const arr = Array.isArray(cRes.data)
            ? (cRes.data as any)
            : (cRes.data as any).data || [];
          setCountries(arr);
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  // Benefits handlers
  const addBenefit = () => {
    setBenefits([...benefits, { title: "", description: "", icon: "Star" }]);
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const updateBenefit = (
    index: number,
    field: keyof BenefitItem,
    value: string,
  ) => {
    const updated = [...benefits];
    updated[index] = { ...updated[index], [field]: value };
    setBenefits(updated);
  };

  // Help steps handlers
  const addHelpStep = () => {
    setHelpSteps([...helpSteps, { title: "", description: "" }]);
  };

  const removeHelpStep = (index: number) => {
    setHelpSteps(helpSteps.filter((_, i) => i !== index));
  };

  const updateHelpStep = (
    index: number,
    field: keyof HelpStepItem,
    value: string,
  ) => {
    const updated = [...helpSteps];
    updated[index] = { ...updated[index], [field]: value };
    setHelpSteps(updated);
  };

  const form = useAppForm({
    defaultValues: {
      // Core
      destinationId: initialData?.destinationId || "",
      intake: (initialData?.intake as any) || "JANUARY",
      title: initialData?.title || "",
      description: initialData?.description || "",
      status: initialData?.status || "DRAFT",

      // Country/Global
      countryId: (initialData as any)?.countryId || "",
      isGlobal: (initialData as any)?.isGlobal || false,

      // Hero Section
      heroTitle: (initialData as any)?.heroTitle || "",
      heroSubtitle: (initialData as any)?.heroSubtitle || "",
      heroMedia: initialData?.heroMedia || "",
      heroCTALabel: (initialData as any)?.heroCTALabel || "",
      heroCTAUrl: (initialData as any)?.heroCTAUrl || "",

      // Why Choose
      whyChooseTitle: (initialData as any)?.whyChooseTitle || "",
      whyChooseDescription: (initialData as any)?.whyChooseDescription || "",

      // Timeline - just deadline
      targetDate: (initialData as any)?.targetDate
        ? new Date((initialData as any).targetDate).toISOString().split("T")[0]
        : "",
      timelineEnabled: (initialData as any)?.timelineEnabled ?? true,

      // How We Help
      howWeHelpEnabled: (initialData as any)?.howWeHelpEnabled ?? true,

      // SEO
      metaTitle: (initialData as any)?.metaTitle || "",
      metaDescription: (initialData as any)?.metaDescription || "",
      metaKeywords: (initialData as any)?.metaKeywords || "",
    } as unknown as FormData,
    validators: { onSubmit: schema as any },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        // Filter out empty benefits
        const validBenefits = benefits.filter((b) => b.title.trim());

        // Filter out empty help steps
        const validHelpSteps = helpSteps.filter((s) => s.title.trim());

        const payload = {
          ...value,
          description: value.description || null,
          countryId: value.countryId || null,
          heroTitle: value.heroTitle || null,
          heroSubtitle: value.heroSubtitle || null,
          heroMedia: value.heroMedia || null,
          heroCTALabel: value.heroCTALabel || null,
          heroCTAUrl: value.heroCTAUrl || null,
          whyChooseTitle: value.whyChooseTitle || null,
          whyChooseDescription: value.whyChooseDescription || null,
          targetDate: value.targetDate || null,
          howWeHelpJson: validHelpSteps.length > 0 ? validHelpSteps : null,
          metaTitle: value.metaTitle || null,
          metaDescription: value.metaDescription || null,
          metaKeywords: value.metaKeywords || null,
          status: value.status || "DRAFT",
          // Benefits as separate items
          benefits: validBenefits.map((b, index) => ({
            title: b.title,
            description: b.description,
            icon: b.icon,
            sortOrder: index,
          })),
        } as Record<string, unknown>;

        const res =
          isEditing && initialData?.id
            ? await api.update(initialData.id, payload)
            : await api.create(payload);

        if (res.error) {
          toast.error(res.error);
          return;
        }
        toast.success(
          isEditing ? "Intake page updated" : "Intake page created",
        );
        await queryClient.invalidateQueries({
          queryKey: ["data-table", "/api/intake-pages"],
        });
        router.push("/dashboard/intake-pages");
        onSuccess?.();
      } catch (e) {
        toast.error("Request failed");
        console.error(e);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* Core Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.AppField name="destinationId">
                {(field) => (
                  <field.Select label="Destination">
                    <SelectItem value="_none_">
                      -- Select Destination --
                    </SelectItem>
                    {destinations.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </field.Select>
                )}
              </form.AppField>

              <form.AppField name="intake">
                {(field) => (
                  <field.Select label="Intake Month">
                    <SelectItem value="JANUARY">January</SelectItem>
                    <SelectItem value="MAY">May</SelectItem>
                    <SelectItem value="SEPTEMBER">September</SelectItem>
                  </field.Select>
                )}
              </form.AppField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.AppField name="countryId">
                {(field) => (
                  <field.Select label="Country (optional)">
                    <SelectItem value="_none_">
                      -- Global (All Countries) --
                    </SelectItem>
                    {countries.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </field.Select>
                )}
              </form.AppField>

              <form.AppField name="status">
                {(field) => (
                  <field.Select label="Status">
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                  </field.Select>
                )}
              </form.AppField>
            </div>

            <form.AppField name="title">
              {(field) => <field.Input label="Title" />}
            </form.AppField>

            <form.AppField name="description">
              {(field) => <field.Textarea label="Description" />}
            </form.AppField>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <form.AppField name="heroTitle">
              {(field) => <field.Input label="Hero Title" />}
            </form.AppField>

            <form.AppField name="heroSubtitle">
              {(field) => <field.Textarea label="Hero Subtitle" />}
            </form.AppField>

            {/* Hero Media - Using ImageUpload Component */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Hero Media</Label>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Image Upload
                </Label>
                <ImageUpload
                  value={
                    (form.getFieldValue("heroMedia") as string) &&
                    !isVideoUrl(form.getFieldValue("heroMedia") as string)
                      ? (form.getFieldValue("heroMedia") as string)
                      : ""
                  }
                  onChange={(url) => form.setFieldValue("heroMedia", url)}
                  folder="intake-hero"
                  label=""
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.AppField name="heroCTALabel">
                {(field) => (
                  <field.Input
                    label="CTA Button Label"
                    placeholder="Apply Now"
                  />
                )}
              </form.AppField>

              <form.AppField name="heroCTAUrl">
                {(field) => (
                  <field.Input
                    label="CTA Button URL"
                    placeholder="/apply-now"
                  />
                )}
              </form.AppField>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Why Choose Section - Dynamic Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Why Choose This Intake?</CardTitle>
          <CardDescription>
            Add benefit cards that will appear on the intake page. These help
            students understand why they should choose this intake.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <form.AppField name="whyChooseTitle">
              {(field) => (
                <field.Input
                  label="Section Title"
                  placeholder="Why Choose January Intake?"
                />
              )}
            </form.AppField>

            <form.AppField name="whyChooseDescription">
              {(field) => <field.Textarea label="Section Description" />}
            </form.AppField>
          </FieldGroup>

          <div className="border-t pt-4 border-border">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-sm font-medium">Benefit Cards</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBenefit}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Benefit
              </Button>
            </div>

            {benefits.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-border rounded-lg text-muted-foreground">
                <p className="mb-2">No benefits added yet</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBenefit}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add First Benefit
                </Button>
              </div>
            )}

            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-start p-4 bg-muted/40 rounded-lg border border-border"
                >
                  <div className="flex-shrink-0 mt-2 text-muted-foreground cursor-grab">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <Label className="text-xs mb-1 block">Icon</Label>
                      <select
                        value={benefit.icon}
                        onChange={(e) =>
                          updateBenefit(index, "icon", e.target.value)
                        }
                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                      >
                        {AVAILABLE_ICONS.map((icon) => (
                          <option key={icon.value} value={icon.value}>
                            {icon.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Title</Label>
                      <Input
                        value={benefit.title}
                        onChange={(e) =>
                          updateBenefit(index, "title", e.target.value)
                        }
                        placeholder="Wide Course Selection"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-xs mb-1 block">Description</Label>
                      <Input
                        value={benefit.description}
                        onChange={(e) =>
                          updateBenefit(index, "description", e.target.value)
                        }
                        placeholder="Access to hundreds of programs"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:text-destructive"
                    onClick={() => removeBenefit(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Deadline */}
      <Card>
        <CardHeader>
          <CardTitle>Application Deadline</CardTitle>
          <CardDescription>
            Set the deadline for this intake. A countdown timer will be
            displayed on the page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="flex items-center space-x-2 mb-4">
              <form.AppField name="timelineEnabled">
                {(field) => (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="timelineEnabled"
                      checked={field.state.value as boolean}
                      onCheckedChange={(checked) => field.handleChange(checked)}
                    />
                    <Label htmlFor="timelineEnabled">
                      Show Countdown Timer
                    </Label>
                  </div>
                )}
              </form.AppField>
            </div>

            <form.AppField name="targetDate">
              {(field) => (
                <field.Input label="Application Deadline" type="date" />
              )}
            </form.AppField>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* How We Help Section - Dynamic Cards */}
      <Card>
        <CardHeader>
          <CardTitle>How We Help</CardTitle>
          <CardDescription>
            Describe the steps of how NWC helps students through the application
            process.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <form.AppField name="howWeHelpEnabled">
              {(field) => (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="howWeHelpEnabled"
                    checked={field.state.value as boolean}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                  />
                  <Label htmlFor="howWeHelpEnabled">
                    Show How We Help Section
                  </Label>
                </div>
              )}
            </form.AppField>
          </div>

          <div className="flex items-center justify-between mb-4">
            <Label className="text-sm font-medium">Help Steps</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addHelpStep}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Step
            </Button>
          </div>

          <div className="space-y-3">
            {helpSteps.map((step, index) => (
              <div
                key={index}
                className="flex gap-3 items-start p-4 bg-muted/40 rounded-lg border border-border"
              >
                <div className="flex-shrink-0 mt-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs mb-1 block">Title</Label>
                    <Input
                      value={step.title}
                      onChange={(e) =>
                        updateHelpStep(index, "title", e.target.value)
                      }
                      placeholder="Free Consultation"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Description</Label>
                    <Input
                      value={step.description}
                      onChange={(e) =>
                        updateHelpStep(index, "description", e.target.value)
                      }
                      placeholder="Get personalized guidance..."
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 text-destructive hover:text-destructive"
                  onClick={() => removeHelpStep(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {helpSteps.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
              <p className="mb-2">No help steps added</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addHelpStep}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add First Step
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <form.AppField name="metaTitle">
              {(field) => <field.Input label="Meta Title" />}
            </form.AppField>

            <form.AppField name="metaDescription">
              {(field) => <field.Textarea label="Meta Description" />}
            </form.AppField>

            <form.AppField name="metaKeywords">
              {(field) => (
                <field.Input
                  label="Meta Keywords"
                  placeholder="keyword1, keyword2, keyword3"
                />
              )}
            </form.AppField>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/intake-pages")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <SubmitButton
          isSubmitting={isSubmitting}
          submitText={isEditing ? "Update" : "Create"}
          submittingText={isEditing ? "Updating..." : "Creating..."}
        />
      </div>
    </form>
  );
}
