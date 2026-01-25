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
import { ImageUpload } from "@/components/ui/image-upload";
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
import { IconPicker } from "@/components/ui/icon-picker";
import { apiClient } from "@/lib/api-client";
import { useEffect, useTransition } from "react";
import MultiSelect from "@/components/ui/multi-select";
import { toast } from "sonner";

interface IntakeFormProps {
  intake?: IntakePageWithRelations;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

type IntakeFormValues = {
  intakeSeasonId: string;
  universityIds: string[];
  status: string;
  heroTitle: string;
  heroSubtitle: string;
  heroMedia: string;
  heroCTALabel: string;
  heroCTAUrl: string;
  whyChooseTitle: string;
  whyChooseDescription: string;
  targetDate: string;
  timelineEnabled: boolean;
  howWeHelpEnabled: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
};

export function IntakeForm({
  intake,
  onSubmit,
  isLoading = false,
}: IntakeFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [intakeSeasons, setIntakeSeasons] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [loadingSeasons, setLoadingSeasons] = useState(false);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [benefits, setBenefits] = useState(
    intake?.intakePageBenefits || [
      {
        id: "1",
        title: "Diverse Course Options",
        description: "Explore a wide range of programs tailored to your career goals.",
        icon: "BookOpen",
        sortOrder: 0,
        isActive: true,
      },
    ],
  );

  const [howWeHelpItems, setHowWeHelpItems] = useState<any[]>(
    intake?.howWeHelpItems || [
      {
        id: "1",
        title: "Expert Consultation",
        description: "Our advisors guide you through every step of the process.",
        icon: "Users",
        sortOrder: 0,
        isActive: true,
      },
    ],
  );

  useEffect(() => {
    const fetchSeasons = async () => {
      setLoadingSeasons(true);
      try {
        const res = await apiClient.get<any>("/api/intake-seasons", { limit: "1000" });
        if (res.data) {
          const arr = Array.isArray(res.data) ? res.data : (res.data as any).data || [];
          setIntakeSeasons(arr);
        }
      } catch (e) {
        console.error("Failed to fetch intake seasons", e);
      } finally {
        setLoadingSeasons(false);
      }
    };
    fetchSeasons();

    const fetchUniversities = async () => {
      setLoadingUniversities(true);
      try {
        const res = await apiClient.get<any>("/api/universities", { limit: "1000", status: "ACTIVE" });
        if (res.data) {
          const arr = Array.isArray(res.data) ? res.data : (res.data as any).data || [];
          setUniversities(arr.map((u: any) => ({ value: u.id, label: u.name })));
        }
      } catch (e) {
        console.error("Failed to fetch universities", e);
      } finally {
        setLoadingUniversities(false);
      }
    };
    fetchUniversities();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IntakeFormValues>({
    defaultValues: {
      intakeSeasonId: intake?.intakeSeasonId || "__none__",
      universityIds: intake?.topUniversities?.map((u: any) => u.universityId) || [],
      status: intake?.status || "DRAFT",

      // Hero Section
      heroTitle: intake?.heroTitle || "",
      heroSubtitle: intake?.heroSubtitle || "",
      heroMedia: intake?.heroMedia || "",
      heroCTALabel: intake?.heroCTALabel || "Apply Now",
      heroCTAUrl: intake?.heroCTAUrl || "/apply-now",

      // Why Choose Section
      whyChooseTitle: intake?.whyChooseTitle || "",
      whyChooseDescription: intake?.whyChooseDescription || "",

      // Timeline
      targetDate: intake?.targetDate
        ? new Date(intake.targetDate).toISOString().slice(0, 10)
        : "",
      timelineEnabled: intake?.timelineEnabled ?? true,

      // How We Help
      howWeHelpEnabled: intake?.howWeHelpEnabled ?? true,

      // SEO
      metaTitle: intake?.metaTitle || "",
      metaDescription: intake?.metaDescription || "",
      metaKeywords: intake?.metaKeywords || "",
    },
  });

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

  const addHowWeHelpItem = () => {
    const newItem = {
      id: Date.now().toString(),
      title: "",
      description: "",
      icon: "",
      sortOrder: howWeHelpItems.length,
      isActive: true,
    };
    setHowWeHelpItems([...howWeHelpItems, newItem]);
  };

  const removeHowWeHelpItem = (id: string) => {
    setHowWeHelpItems(howWeHelpItems.filter((i: any) => i.id !== id));
  };

  const updateHowWeHelpItem = (id: string, field: string, value: any) => {
    setHowWeHelpItems(
      howWeHelpItems.map((i: any) => (i.id === id ? { ...i, [field]: value } : i)),
    );
  };

  const [isPending, startTransition] = useTransition();

  const onFormSubmit = async (data: any) => {
    const formData = {
      ...data,
      intakeSeasonId: data.intakeSeasonId === "__none__" ? null : data.intakeSeasonId,
      universityIds: data.universityIds || [],
      intakePageBenefits: benefits,
      howWeHelpItems: howWeHelpItems,
    };

    startTransition(async () => {
      try {
        await onSubmit(formData);
        toast.success(intake ? "Intake updated successfully" : "Intake created successfully");
      } catch (e: any) {
        if (e.message !== "NEXT_REDIRECT") {
          console.error("Form submission failed", e);
          toast.error(e.message || "Failed to save intake");
        }
      }
    });
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
          <Button type="submit" disabled={isPending}>
            <Save className="w-4 h-4 mr-2" />
            {isPending ? "Saving..." : "Save"}
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
                  <Label htmlFor="intakeSeasonId">Intake Season (link to details)</Label>
                  <Select
                    value={watch("intakeSeasonId")}
                    onValueChange={(value) => setValue("intakeSeasonId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingSeasons ? "Loading seasons..." : "Select intake season"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">None / Select later</SelectItem>
                      {intakeSeasons.map((season) => (
                        <SelectItem key={season.id} value={season.id}>
                          {season.title} ({season.intake} {season.year})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
               
                  <ImageUpload
                    value={watch("heroMedia")}
                    onChange={(url) => setValue("heroMedia", url || "")}
                    folder="intakes"
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
                          value={benefit.title}
                          onChange={(e) =>
                            updateBenefit(benefit.id, "title", e.target.value)
                          }
                        />
                        <IconPicker
                          label="Icon"
                          value={benefit.icon || ""}
                          onChange={(iconName) =>
                            updateBenefit(benefit.id, "icon", iconName)
                          }
                        />
                      </div>
                      <Textarea
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
                <Label htmlFor="timelineEnabled">Enable timeline countdown</Label>
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
                <Label htmlFor="howWeHelpEnabled">Enable How We Help section</Label>
              </div>

              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Help Items</h4>
                <Button type="button" size="sm" onClick={addHowWeHelpItem}>
                  <Plus className="w-4 h-4 mr-1" /> Add Help Item
                </Button>
              </div>

              <div className="space-y-4">
                {howWeHelpItems.map((item: any, index: number) => (
                  <Card key={item.id}>
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Item {index + 1}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={item.isActive ?? true}
                              onCheckedChange={(checked) =>
                                updateHowWeHelpItem(item.id, "isActive", checked)
                              }
                              id={`help-active-${item.id}`}
                            />
                            <Label htmlFor={`help-active-${item.id}`}>
                              Active
                            </Label>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeHowWeHelpItem(item.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          value={item.title}
                          onChange={(e) =>
                            updateHowWeHelpItem(item.id, "title", e.target.value)
                          }
                        />
                        <IconPicker
                          label="Icon"
                          value={item.icon || ""}
                          onChange={(iconName) =>
                            updateHowWeHelpItem(item.id, "icon", iconName)
                          }
                        />
                      </div>
                      <Textarea
                        value={item.description || ""}
                        onChange={(e) =>
                          updateHowWeHelpItem(
                            item.id,
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
                            value={item.sortOrder}
                            onChange={(e) =>
                              updateHowWeHelpItem(
                                item.id,
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
              <CardTitle>Top Universities</CardTitle>
              <CardDescription>
                Select the top universities to display on this intake page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MultiSelect
                options={universities}
                value={watch("universityIds") || []}
                onChange={(value) => setValue("universityIds", value)}
                placeholder={loadingUniversities ? "Loading universities..." : "Select universities"}
              />
            </CardContent>
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
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate keywords with commas
                </p>
              </div>

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}
