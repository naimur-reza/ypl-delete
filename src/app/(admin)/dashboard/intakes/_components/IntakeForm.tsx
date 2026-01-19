"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload, Eye, Save } from "lucide-react";
import { IntakePageWithRelations } from "@/types";

interface IntakeFormProps {
  intake?: IntakePageWithRelations;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

type IntakeFormValues = {
  title: string;
  slug: string;
  description: string;
  destinationId: string;
  intake: string;
  countryId: string;
  isGlobal: boolean;
  status: string;
  heroTitle: string;
  heroSubtitle: string;
  heroMedia: string;
  heroMediaType: "IMAGE" | "VIDEO" | "TEXT_ONLY";
  heroCTALabel: string;
  heroCTAUrl: string;
  whyChooseTitle: string;
  whyChooseDescription: string;
  timelineJson: string;
  targetDate: string;
  timelineEnabled: boolean;
  howWeHelpJson: string;
  howWeHelpEnabled: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
};

const INTAKE_OPTIONS = [
  { value: "JANUARY", label: "January" },
  { value: "MAY", label: "May" },
  { value: "SEPTEMBER", label: "September" },
];

const DESTINATION_OPTIONS = [
  { value: "uk", label: "United Kingdom" },
  { value: "usa", label: "United States" },
  { value: "canada", label: "Canada" },
  { value: "australia", label: "Australia" },
];

const COUNTRY_OPTIONS = [
  { value: "", label: "Global (All Countries)" },
  { value: "bangladesh", label: "Bangladesh" },
  { value: "india", label: "India" },
  { value: "pakistan", label: "Pakistan" },
  { value: "srilanka", label: "Sri Lanka" },
  { value: "nepal", label: "Nepal" },
];

const ICON_OPTIONS = [
  "GraduationCap",
  "Clock",
  "DollarSign",
  "Users",
  "Star",
  "Award",
  "BookOpen",
  "Target",
  "CheckCircle",
  "FileText",
  "Plane",
  "Building",
];

const HERO_MEDIA_OPTIONS = [
  { value: "IMAGE", label: "Image" },
  { value: "VIDEO", label: "Video" },
  { value: "TEXT_ONLY", label: "Text Only" },
];

export function IntakeForm({
  intake,
  onSubmit,
  isLoading = false,
}: IntakeFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [benefits, setBenefits] = useState(
    intake?.intakePageBenefits || [
      {
        id: "1",
        title: "",
        description: "",
        icon: "",
        sortOrder: 0,
        isActive: true,
      },
    ],
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IntakeFormValues>({
    defaultValues: {
      title: intake?.title || "",
      slug: intake?.slug || "",
      description: intake?.description || "",
      destinationId: intake?.destinationId || "",
      intake: intake?.intake || "",
      countryId: intake?.countryId || "",
      isGlobal: intake?.isGlobal || false,
      status: intake?.status || "DRAFT",

      // Hero Section
      heroTitle: intake?.heroTitle || "",
      heroSubtitle: intake?.heroSubtitle || "",
      heroMedia: intake?.heroMedia || "",
      heroMediaType: intake?.heroMediaType || "IMAGE",
      heroCTALabel: intake?.heroCTALabel || "Apply Now",
      heroCTAUrl: intake?.heroCTAUrl || "/apply-now",

      // Why Choose Section
      whyChooseTitle: intake?.whyChooseTitle || "",
      whyChooseDescription: intake?.whyChooseDescription || "",

      // Timeline
      timelineJson: intake?.timelineJson
        ? JSON.stringify(intake.timelineJson, null, 2)
        : "",
      targetDate: intake?.targetDate
        ? new Date(intake.targetDate).toISOString().slice(0, 10)
        : "",
      timelineEnabled: intake?.timelineEnabled ?? true,

      // How We Help
      howWeHelpJson: intake?.howWeHelpJson
        ? JSON.stringify(intake.howWeHelpJson, null, 2)
        : "",
      howWeHelpEnabled: intake?.howWeHelpEnabled ?? true,

      // SEO
      metaTitle: intake?.metaTitle || "",
      metaDescription: intake?.metaDescription || "",
      metaKeywords: intake?.metaKeywords || "",
      canonicalUrl: intake?.canonicalUrl || "",
    },
  });

  const isGlobal = watch("isGlobal");
  const addBenefit = () => {
    const newBenefit = {
      id: Date.now().toString(),
      title: "",
      description: "",
      icon: "",
      sortOrder: benefits.length,
      isActive: true,
    };
    setBenefits([...benefits, newBenefit]);
  };

  const removeBenefit = (id: string) => {
    setBenefits(benefits.filter((b) => b.id !== id));
  };

  const updateBenefit = (id: string, field: string, value: any) => {
    setBenefits(
      benefits.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
    );
  };

  const onFormSubmit = (data: any) => {
    const formData = {
      ...data,
      intakePageBenefits: benefits,
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {intake ? "Edit Intake" : "Create New Intake"}
          </h2>
          <p className="text-gray-600 mt-1">
            {intake ? "Update intake page details" : "Create a new intake page"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Configure the basic settings for this intake page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="destination">Destination *</Label>
                  <Select
                    value={watch("destinationId")}
                    onValueChange={(value) => setValue("destinationId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {DESTINATION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="intake">Intake *</Label>
                  <Select
                    value={watch("intake")}
                    onValueChange={(value) => setValue("intake", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select intake" />
                    </SelectTrigger>
                    <SelectContent>
                      {INTAKE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...register("title", { required: true })}
                    placeholder="e.g., May Intake 2024"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    {...register("slug", { required: true })}
                    placeholder="may-intake"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={watch("status")}
                    onValueChange={(value) => setValue("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Switch
                    id="isGlobal"
                    checked={isGlobal}
                    onCheckedChange={(checked) => setValue("isGlobal", checked)}
                  />
                  <Label htmlFor="isGlobal">Global intake (all countries)</Label>
                </div>
                <div>
                  <Label htmlFor="countryId">Country (if country-specific)</Label>
                  <Select
                    value={watch("countryId") || ""}
                    onValueChange={(value) => setValue("countryId", value || "")}
                    disabled={isGlobal}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="heroMediaType">Hero Media Type</Label>
                <Select
                  value={
                    watch("heroMediaType") as IntakeFormValues["heroMediaType"]
                  }
                  onValueChange={(value) =>
                    setValue(
                      "heroMediaType",
                      value as IntakeFormValues["heroMediaType"],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent>
                    {HERO_MEDIA_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero</CardTitle>
              <CardDescription>
                Title, subtitle and media for the hero section.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="heroTitle">Hero Title</Label>
                  <Input id="heroTitle" {...register("heroTitle")} />
                </div>
                <div>
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Textarea
                    id="heroSubtitle"
                    rows={3}
                    {...register("heroSubtitle")}
                  />
                </div>
                <div>
                  <Label htmlFor="heroMedia">Background Media (image/video)</Label>
                  <Input
                    id="heroMedia"
                    placeholder="https://..."
                    {...register("heroMedia")}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="heroCTALabel">CTA Label</Label>
                    <Input id="heroCTALabel" {...register("heroCTALabel")} />
                  </div>
                  <div>
                    <Label htmlFor="heroCTAUrl">CTA URL</Label>
                    <Input id="heroCTAUrl" {...register("heroCTAUrl")} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why Choose Intake</CardTitle>
              <CardDescription>
                Heading and benefits cards (intakeBenefits).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="whyChooseTitle">Section Title</Label>
                  <Input id="whyChooseTitle" {...register("whyChooseTitle")} />
                </div>
                <div>
                  <Label htmlFor="whyChooseDescription">Section Description</Label>
                  <Textarea
                    id="whyChooseDescription"
                    rows={3}
                    {...register("whyChooseDescription")}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Benefits</h4>
                <Button type="button" size="sm" onClick={addBenefit}>
                  <Plus className="w-4 h-4 mr-1" /> Add Benefit
                </Button>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <Card key={benefit.id}>
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Benefit {index + 1}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={benefit.isActive ?? true}
                              onCheckedChange={(checked) =>
                                updateBenefit(benefit.id, "isActive", checked)
                              }
                              id={`benefit-active-${benefit.id}`}
                            />
                            <Label htmlFor={`benefit-active-${benefit.id}`}>
                              Active
                            </Label>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeBenefit(benefit.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Title"
                          value={benefit.title}
                          onChange={(e) =>
                            updateBenefit(benefit.id, "title", e.target.value)
                          }
                        />
                        <Input
                          placeholder="Icon (Lucide name)"
                          value={benefit.icon || ""}
                          onChange={(e) =>
                            updateBenefit(benefit.id, "icon", e.target.value)
                          }
                        />
                      </div>
                      <Textarea
                        placeholder="Description"
                        value={benefit.description || ""}
                        onChange={(e) =>
                          updateBenefit(
                            benefit.id,
                            "description",
                            e.target.value,
                          )
                        }
                      />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Sort Order</Label>
                          <Input
                            type="number"
                            value={benefit.sortOrder}
                            onChange={(e) =>
                              updateBenefit(
                                benefit.id,
                                "sortOrder",
                                Number(e.target.value),
                              )
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Timeline & Countdown</CardTitle>
              <CardDescription>
                Provide the target date and steps (JSON array).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Switch
                  id="timelineEnabled"
                  checked={watch("timelineEnabled")}
                  onCheckedChange={(checked) => setValue("timelineEnabled", checked)}
                />
                <Label htmlFor="timelineEnabled">Enable timeline</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetDate">Countdown Target Date</Label>
                  <Input
                    type="date"
                    id="targetDate"
                    {...register("targetDate")}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="timelineJson">Timeline JSON</Label>
                <Textarea
                  id="timelineJson"
                  rows={6}
                  placeholder='[{"title":"Apply","date":"2024-12-01","description":"Submit application"}]'
                  {...register("timelineJson")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Help</CardTitle>
              <CardDescription>Steps/cards describing support.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Switch
                  id="howWeHelpEnabled"
                  checked={watch("howWeHelpEnabled")}
                  onCheckedChange={(checked) => setValue("howWeHelpEnabled", checked)}
                />
                <Label htmlFor="howWeHelpEnabled">Enable How We Help</Label>
              </div>
              <div>
                <Label htmlFor="howWeHelpJson">How We Help JSON</Label>
                <Textarea
                  id="howWeHelpJson"
                  rows={6}
                  placeholder='[{"title":"Free Consultation","description":"We guide you"}]'
                  {...register("howWeHelpJson")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Universities</CardTitle>
              <CardDescription>
                This section auto-loads all ACTIVE universities for the destination. No manual config needed.
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Configure meta tags and SEO optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  {...register("metaTitle")}
                  placeholder="SEO meta title (max 60 characters)"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 50-60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  {...register("metaDescription")}
                  placeholder="SEO meta description (max 160 characters)"
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 150-160 characters
                </p>
              </div>

              <div>
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  {...register("metaKeywords")}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate keywords with commas
                </p>
              </div>

              <div>
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input
                  id="canonicalUrl"
                  {...register("canonicalUrl")}
                  placeholder="https://www.nwc.education.com/intake-page"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}
