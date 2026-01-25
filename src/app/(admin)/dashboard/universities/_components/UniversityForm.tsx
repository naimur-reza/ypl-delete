"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/use-field-context";
import { useAutoSlug } from "@/hooks/use-auto-slug";
import { universitySchema } from "@/schemas/university";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi, apiClient } from "@/lib/api-client";
import { generateSlug } from "@/lib/utils";
import { SelectItem } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { CountrySelect } from "@/components/ui/region-select";

import { FormBase } from "@/components/form/FormBase";
import { Input } from "@/components/ui/input";
import { University } from "../../../../../../prisma/src/generated/prisma/browser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FormData = z.infer<typeof universitySchema>;

const universityApi = createEntityApi<University>("/api/universities");

interface Destination {
  id: string;
  name: string;
}

const useFetchData = <T,>(endpoint: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<{ data: T[] }>(endpoint, {
          limit: "1000",
        });
        if (response.data) {
          setData(
            Array.isArray(response.data)
              ? response.data
              : response.data.data || []
          );
        }
      } catch (err) {
        console.error(`Failed to fetch ${endpoint}:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint]);

  return { data, loading };
};

interface UniversityFormProps {
  initialData?: University & {
    country?: { name: string };
    destination?: { name: string };
    countries?: Array<{ country: { id: string } }>;
    status?: any; // Enum type mismatch workaround
    detail?: any; // Allow detail prop
  };
  onSuccess?: () => void;
}

export function UniversityForm({
  initialData,
  onSuccess,
}: UniversityFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!initialData;
  const { data: destinations, loading: loadingDestinations } =
    useFetchData<Destination>("/api/destinations");

  const [imageUrl, setImageUrl] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [servicesImageUrl, setServicesImageUrl] = useState<string>("");
  const [accommodationImageUrl, setAccommodationImageUrl] = useState<string>("");

  const [countryIds, setCountryIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [isServicesUploading, setIsServicesUploading] = useState(false);
  const [isAccommodationUploading, setIsAccommodationUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGlobal, setIsGlobal] = useState<boolean>((initialData as any)?.isGlobal || false);

  const getDefaultValues = (): FormData => ({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    logo: initialData?.logo || "",
    thumbnail: initialData?.thumbnail || "",
    description: initialData?.description || "",
    providerType: initialData?.providerType || "PRIVATE",
    isFeatured: initialData?.isFeatured ?? false,
    website: initialData?.website || "",
    address: initialData?.address || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    countryIds: initialData?.countries?.map((c) => c.country.id) || [],
    destinationId: initialData?.destinationId || "",
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
    metaKeywords: initialData?.metaKeywords || "",
    status: (initialData?.status as any) || "ACTIVE",
    isGlobal: (initialData as any)?.isGlobal || false,
    // Details
    rankingNumber: initialData?.rankingNumber ?? null,
    costOfStudying: initialData?.costOfStudying || "",
    overview: initialData?.detail?.overview || "",
    ranking: initialData?.detail?.ranking || "",
    tuitionFees: initialData?.detail?.tuitionFees || "",
    famousFor: initialData?.detail?.famousFor || "",
    servicesHeading: initialData?.detail?.servicesHeading || "",
    servicesDescription: initialData?.detail?.servicesDescription || "",
    servicesImage: initialData?.detail?.servicesImage || "",
    entryRequirements: initialData?.detail?.entryRequirements || "",
    accommodation: initialData?.detail?.accommodation || "",
    accommodationImage: initialData?.detail?.accommodationImage || "",
  });

  const form = useAppForm({
    defaultValues: getDefaultValues(),
    validators: { onSubmit: universitySchema as any },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const transformToNullable = (data: FormData) => ({
          ...data,
          logo: logoUrl || null,
          thumbnail: imageUrl || null,
          description: data.description || null,
          website: data.website || null,
          address: data.address || null,
          phone: data.phone || null,
          email: data.email || null,
          metaTitle: data.metaTitle || null,
          metaDescription: data.metaDescription || null,
          metaKeywords: data.metaKeywords || null,
          // Detail fields transformation
          servicesImage: servicesImageUrl || null,
          accommodationImage: accommodationImageUrl || null,
          ranking: data.ranking || null,
          tuitionFees: data.tuitionFees || null,
          famousFor: data.famousFor || null,
          servicesHeading: data.servicesHeading || null,
          servicesDescription: data.servicesDescription || null,
          accommodation: data.accommodation || null,
          rankingNumber: data.rankingNumber || null,
          costOfStudying: data.costOfStudying || null,
          overview: data.overview || null,
          entryRequirements: data.entryRequirements || null,
        });

        const submitData = {
          ...transformToNullable(value),
          countryIds: isGlobal ? [] : countryIds,
          isGlobal: isGlobal,
        };

        const response =
          isEditing && initialData?.id
            ? await universityApi.update(
                initialData.id,
                submitData as Partial<University>
              )
            : await universityApi.create({
                ...submitData,
                createdBy: null,
                updatedBy: null,
              } as Omit<University, "id" | "createdAt" | "updatedAt">);

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success(
          isEditing
            ? "University updated successfully"
            : "University created successfully"
        );
        form.reset();
        setCountryIds([]);
        setImageUrl("");
        setLogoUrl("");
        setServicesImageUrl("");
        setAccommodationImageUrl("");
        await queryClient.invalidateQueries({
          queryKey: ["data-table", "/api/universities"],
        });
        router.push("/dashboard/universities");
        onSuccess?.();
      } catch (err) {
        toast.error("Request failed");
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (initialData) {
      const initialCountryIds =
        initialData.countries?.map((c) => c.country.id) || [];
      setCountryIds(initialCountryIds);
      form.setFieldValue("countryIds", initialCountryIds);
      setImageUrl(initialData.thumbnail || "");
      setLogoUrl(initialData.logo || "");
      setServicesImageUrl(initialData.detail?.servicesImage || "");
      setAccommodationImageUrl(initialData.detail?.accommodationImage || "");
      setIsGlobal((initialData as any)?.isGlobal || false);
    } else {
      setCountryIds([]);
      form.setFieldValue("countryIds", []);
      setImageUrl("");
      setLogoUrl("");
      setServicesImageUrl("");
      setAccommodationImageUrl("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // Auto-slug generation from name
  const { handleTitleChange, handleSlugChange } = useAutoSlug({
    getSlugValue: () => form.getFieldValue("slug") || "",
    setSlugValue: (value) => form.setFieldValue("slug", value),
    isEditing: isEditing,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="admissions">Admissions</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <form.AppField name="name">
              {(field) => (
                <FormBase label="Name">
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      handleTitleChange(e.target.value);
                    }}
                    onBlur={field.handleBlur}
                  />
                </FormBase>
              )}
            </form.AppField>
            <form.AppField name="slug">
              {(field) => (
                <FormBase label="Slug" description="">
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => {
                      const slugValue = generateSlug(e.target.value);
                      field.handleChange(slugValue);
                      handleSlugChange(slugValue);
                    }}
                    onBlur={field.handleBlur}
                  />
                </FormBase>
              )}
            </form.AppField>
            <div className="grid grid-cols-2 gap-4">
              <ImageUpload
                value={logoUrl}
                onChange={setLogoUrl}
                folder="universities/logos"
                label="University Logo"
                onUploadingChange={setIsLogoUploading}
              />
              <ImageUpload
                value={imageUrl}
                onChange={setImageUrl}
                folder="universities"
                label="University Image"
                onUploadingChange={setIsUploading}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <form.AppField name="providerType">
                  {(field) => (
                    <field.Select label="Provider Type">
                      <SelectItem value="UNIVERSITY">University</SelectItem>
                      <SelectItem value="GOVERNMENT">Government</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                      <SelectItem value="EMBASSY">Embassy</SelectItem>
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

            <form.AppField name="countryIds">
              {(field) => (
                <FormBase label="Select Countries">
                  <CountrySelect
                    value={countryIds}
                    onChange={(ids) => {
                      setCountryIds(ids);
                      field.handleChange(ids);
                    }}
                    showGlobalOption={true}
                    isGlobal={isGlobal}
                    onGlobalChange={(checked) => {
                      setIsGlobal(checked);
                      form.setFieldValue("isGlobal", checked);
                      if (checked) {
                        setCountryIds([]);
                        field.handleChange([]);
                      }
                    }}
                  />
                </FormBase>
              )}
            </form.AppField>
            {/* <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting, state.errors]}
            >
              {([canSubmit, isSubmitting, errors]) => {
                if (!canSubmit && !isSubmitting && errors.length > 0 && form.state.submissionAttempts > 0) {
                  // This is a bit tricky to run effects inside render, but for debugging/quick feedback:
                  return (
                    <div className="text-red-500 text-sm font-medium p-2 bg-red-50 border border-red-200 rounded">
                      Please fix the following errors: {errors.map(e => e?.toString()).join(", ")}
                    </div>
                  );
                }
                return null;
              }}
            </form.Subscribe> */}
            <form.AppField name="destinationId">
              {(field) => (
                <field.Select label="Destination">
                  {loadingDestinations ? (
                    <SelectItem value="__loading__" disabled>
                      Loading...
                    </SelectItem>
                  ) : destinations.length === 0 ? (
                    <SelectItem value="__empty__" disabled>
                      No destinations available
                    </SelectItem>
                  ) : (
                    destinations.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))
                  )}
                </field.Select>
              )}
            </form.AppField>
            <div className="grid grid-cols-2 gap-4">
              <form.AppField name="website">
                {(field) => <field.Input label="Website" />}
              </form.AppField>
              <form.AppField name="email">
                {(field) => <field.Input label="Email" />}
              </form.AppField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <form.AppField name="address">
                {(field) => <field.Input label="Address" />}
              </form.AppField>
              <form.AppField name="phone">
                {(field) => <field.Input label="Phone" />}
              </form.AppField>
            </div>
            <form.AppField name="isFeatured">
              {(field) => <field.Checkbox label="Featured" />}
            </form.AppField>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
             <form.AppField name="overview">
               {(field) => <field.RichText label="University Overview" placeholder="Detailed overview..." />}
             </form.AppField>
             <form.AppField name="description">
              {(field) => <field.Textarea label="Short Description (for cards)" />}
            </form.AppField>
             <div className="grid grid-cols-2 gap-4">
                 <form.AppField name="rankingNumber">
                  {(field) => (
                    <field.Input label="Global Ranking (Number)" type="number" min={1} />
                  )}
                </form.AppField>
                 <form.AppField name="costOfStudying">
                  {(field) => (
                    <field.Input
                      label="Cost of Studying (Display)"
                      placeholder="e.g. 10,000 USD/year"
                    />
                  )}
                </form.AppField>
             </div>
              <form.AppField name="ranking">
               {(field) => <field.RichText label="Ranking Details" />}
             </form.AppField>
             <form.AppField name="tuitionFees">
               {(field) => <field.RichText label="Tuition Fees Details" />}
             </form.AppField>
             <form.AppField name="famousFor">
               {(field) => <field.Textarea label="Famous For" />}
             </form.AppField>
          </TabsContent>

          <TabsContent value="admissions" className="space-y-4">
             <form.AppField name="entryRequirements">
               {(field) => <field.RichText label="Entry Requirements" placeholder="Detailed entry requirements..." />}
             </form.AppField>
          </TabsContent>
          
          <TabsContent value="features" className="space-y-4">
             <div className="space-y-4 border rounded-lg p-4 border-border">
                <h4 className="font-medium">Services</h4>
                <form.AppField name="servicesHeading">
                   {(field) => <field.Input label="Services Heading" />}
                 </form.AppField>
                 <form.AppField name="servicesDescription">
                   {(field) => <field.RichText label="Services Description" />}
                 </form.AppField>
                 <ImageUpload
                    value={servicesImageUrl}
                    onChange={setServicesImageUrl}
                    folder="university-details"
                    label="Services Image"
                    onUploadingChange={setIsServicesUploading}
                  />
             </div>
             
             <div className="space-y-4 border rounded-lg p-4 border-border">
                <h4 className="font-medium">Accommodation</h4>
                <form.AppField name="accommodation">
                   {(field) => <field.RichText label="Accommodation Details" />}
                 </form.AppField>
                 <ImageUpload
                    value={accommodationImageUrl}
                    onChange={setAccommodationImageUrl}
                    folder="university-details"
                    label="Accommodation Image"
                    onUploadingChange={setIsAccommodationUploading}
                  />
             </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
              <form.AppField name="metaTitle">
                  {(field) => <field.Input label="Meta Title" />}
              </form.AppField>
              <form.AppField name="metaDescription">
                  {(field) => <field.Textarea label="Meta Description" />}
              </form.AppField>
              <form.AppField name="metaKeywords">
                  {(field) => <field.Input label="Meta Keywords" />}
              </form.AppField>
          </TabsContent>
        </Tabs>
      
        <div className="flex gap-2 justify-end pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/universities")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <SubmitButton
            isSubmitting={isSubmitting}
            isUploading={isUploading || isLogoUploading || isServicesUploading || isAccommodationUploading}
            submitText={isEditing ? "Update" : "Create"}
            submittingText={isEditing ? "Updating..." : "Creating..."}
          />
        </div>
      </FieldGroup>
    </form>
  );
}
