"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/hooks";
import { faqSchema } from "@/schemas/faq";
import { toast } from "sonner";
import z from "zod";
import { createEntityApi, apiClient } from "@/lib/api-client";
import { CountrySelect } from "@/components/ui/region-select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

type FormData = z.infer<typeof faqSchema>;

const faqApi = createEntityApi<FormData & { id: string }>("/api/faqs");

interface Entity {
  id: string;
  name?: string;
  title?: string;
  slug?: string;
}

const FAQFormModal = ({
  isEditing,
  selectedFAQ,
  onClose,
  onSuccess,
}: {
  isEditing?: boolean;
  selectedFAQ?: {
    id: string;
    question: string;
    answer: string;
    isGlobal?: boolean;
    countries?: Array<{ country?: { id: string }; countryId?: string }>;
    destinations?: Array<{
      destination?: { id: string };
      destinationId?: string;
    }>;
    universities?: Array<{
      university?: { id: string };
      universityId?: string;
    }>;
    events?: Array<{ event?: { id: string }; eventId?: string }>;
    courses?: Array<{ course?: { id: string }; courseId?: string }>;
    scholarships?: Array<{
      scholarship?: { id: string };
      scholarshipId?: string;
    }>;
    intakePages?: Array<{ intakePage?: { id: string }; intakePageId?: string }>;
  };
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const isOpen = true;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryIds, setCountryIds] = useState<string[]>(
    selectedFAQ?.countries?.map(
      (r: { country?: { id: string }; countryId?: string }) =>
        r.country?.id || r.countryId || ""
    ) || []
  );
  const [destinationIds, setDestinationIds] = useState<string[]>(
    selectedFAQ?.destinations?.map(
      (r: { destination?: { id: string }; destinationId?: string }) =>
        r.destination?.id || r.destinationId || ""
    ) || []
  );
  const [universityIds, setUniversityIds] = useState<string[]>(
    selectedFAQ?.universities?.map(
      (r: { university?: { id: string }; universityId?: string }) =>
        r.university?.id || r.universityId || ""
    ) || []
  );
  const [eventIds, setEventIds] = useState<string[]>(
    selectedFAQ?.events?.map(
      (r: { event?: { id: string }; eventId?: string }) =>
        r.event?.id || r.eventId || ""
    ) || []
  );
  const [courseIds, setCourseIds] = useState<string[]>(
    selectedFAQ?.courses?.map(
      (r: { course?: { id: string }; courseId?: string }) =>
        r.course?.id || r.courseId || ""
    ) || []
  );
  const [scholarshipIds, setScholarshipIds] = useState<string[]>(
    selectedFAQ?.scholarships?.map(
      (r: { scholarship?: { id: string }; scholarshipId?: string }) =>
        r.scholarship?.id || r.scholarshipId || ""
    ) || []
  );
  const [intakePageIds, setIntakePageIds] = useState<string[]>(
    selectedFAQ?.intakePages?.map(
      (r: { intakePage?: { id: string }; intakePageId?: string }) =>
        r.intakePage?.id || r.intakePageId || ""
    ) || []
  );
  const [isGlobal, setIsGlobal] = useState<boolean>(
    selectedFAQ?.isGlobal || false
  );

  // Entity lists
  const [destinations, setDestinations] = useState<Entity[]>([]);
  const [universities, setUniversities] = useState<Entity[]>([]);
  const [events, setEvents] = useState<Entity[]>([]);
  const [courses, setCourses] = useState<Entity[]>([]);
  const [scholarships, setScholarships] = useState<Entity[]>([]);
  const [intakePages, setIntakePages] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);

  // Search states for each entity type
  const [searchDestinations, setSearchDestinations] = useState("");
  const [searchUniversities, setSearchUniversities] = useState("");
  const [searchEvents, setSearchEvents] = useState("");
  const [searchCourses, setSearchCourses] = useState("");
  const [searchScholarships, setSearchScholarships] = useState("");
  const [searchIntakePages, setSearchIntakePages] = useState("");

  // Filter entities by search term
  const filterEntities = (entities: Entity[], searchTerm: string) => {
    if (!searchTerm) return entities;
    const term = searchTerm.toLowerCase();
    return entities.filter(
      (e) =>
        e.name?.toLowerCase().includes(term) ||
        e.title?.toLowerCase().includes(term) ||
        e.slug?.toLowerCase().includes(term)
    );
  };

  // Helper to render entity list with search
  const renderEntityList = (
    entities: Entity[],
    selectedIds: string[],
    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>,
    fieldName: keyof FormData,
    searchTerm: string,
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
    entityType: string
  ) => {
    const filtered = filterEntities(entities, searchTerm);
    const allSelected =
      filtered.length > 0 && filtered.every((e) => selectedIds.includes(e.id));

    const handleSelectAll = () => {
      const filteredIds = filtered.map((e) => e.id);
      if (allSelected) {
        // Deselect all filtered
        const newIds = selectedIds.filter((id) => !filteredIds.includes(id));
        setSelectedIds(newIds);
        form.setFieldValue(fieldName, newIds);
      } else {
        // Select all filtered
        const newIds = [...new Set([...selectedIds, ...filteredIds])];
        setSelectedIds(newIds);
        form.setFieldValue(fieldName, newIds);
      }
    };

    return (
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${entityType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{selectedIds.length} selected</Badge>
            {filtered.length > 0 && (
              <span className="text-xs text-muted-foreground">
                ({filtered.length} {filtered.length === 1 ? "item" : "items"})
              </span>
            )}
          </div>
          {filtered.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="h-7 text-xs"
            >
              {allSelected ? "Clear All" : "Select All"}
            </Button>
          )}
        </div>
        <div className="h-64 border rounded-md p-3 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Loading...
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {searchTerm ? "No results found" : "No items available"}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {filtered.map((entity) => (
                <div
                  key={entity.id}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={`${entityType}-${entity.id}`}
                    checked={selectedIds.includes(entity.id)}
                    onCheckedChange={() =>
                      handleEntityToggle(
                        entity.id,
                        selectedIds,
                        setSelectedIds,
                        fieldName
                      )
                    }
                  />
                  <Label
                    htmlFor={`${entityType}-${entity.id}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {entity.title || entity.name || entity.slug}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Fetch entities
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const [
          destRes,
          uniRes,
          eventRes,
          courseRes,
          scholarshipRes,
          intakeRes,
        ] = await Promise.all([
          apiClient.get<{ data: Entity[] } | Entity[]>("/api/destinations", {
            limit: "1000",
          }),
          apiClient.get<{ data: Entity[] } | Entity[]>("/api/universities", {
            limit: "1000",
          }),
          apiClient.get<{ data: Entity[] } | Entity[]>("/api/events", {
            limit: "1000",
          }),
          apiClient.get<{ data: Entity[] } | Entity[]>("/api/courses", {
            limit: "1000",
          }),
          apiClient.get<{ data: Entity[] } | Entity[]>("/api/scholarships", {
            limit: "1000",
          }),
          apiClient.get<{ data: Entity[] } | Entity[]>("/api/intake-pages", {
            limit: "1000",
          }),
        ]);

        setDestinations(
          Array.isArray(destRes.data) ? destRes.data : destRes.data?.data || []
        );
        setUniversities(
          Array.isArray(uniRes.data) ? uniRes.data : uniRes.data?.data || []
        );
        setEvents(
          Array.isArray(eventRes.data)
            ? eventRes.data
            : eventRes.data?.data || []
        );
        setCourses(
          Array.isArray(courseRes.data)
            ? courseRes.data
            : courseRes.data?.data || []
        );
        setScholarships(
          Array.isArray(scholarshipRes.data)
            ? scholarshipRes.data
            : scholarshipRes.data?.data || []
        );
        setIntakePages(
          Array.isArray(intakeRes.data)
            ? intakeRes.data
            : intakeRes.data?.data || []
        );
      } catch (error) {
        console.error("Failed to fetch entities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEntities();
  }, []);

  const form = useAppForm({
    defaultValues: {
      question: selectedFAQ?.question || "",
      answer: selectedFAQ?.answer || "",
      countryIds: countryIds,
      destinationIds: destinationIds,
      universityIds: universityIds,
      eventIds: eventIds,
      courseIds: courseIds,
      scholarshipIds: scholarshipIds,
      intakePageIds: intakePageIds,
      isGlobal: isGlobal,
    } satisfies FormData as FormData,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validators: { onSubmit: faqSchema as any },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        let response;
        const submitData = {
          ...value,
          countryIds: countryIds,
          destinationIds: destinationIds,
          universityIds: universityIds,
          eventIds: eventIds,
          courseIds: courseIds,
          scholarshipIds: scholarshipIds,
          intakePageIds: intakePageIds,
          isGlobal: isGlobal,
        };
        if (isEditing && selectedFAQ?.id) {
          response = await faqApi.update(selectedFAQ.id, submitData);
        } else {
          response = await faqApi.create(submitData);
        }

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success(
          isEditing ? "FAQ updated successfully" : "FAQ created successfully"
        );
        form.reset();
        setCountryIds([]);
        setDestinationIds([]);
        setUniversityIds([]);
        setEventIds([]);
        setCourseIds([]);
        setScholarshipIds([]);
        setIntakePageIds([]);
        setIsGlobal(false);
        onClose();
        onSuccess?.();
      } catch (err) {
        toast.error("Request failed");
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleEntityToggle = (
    entityId: string,
    currentIds: string[],
    setIds: React.Dispatch<React.SetStateAction<string[]>>,
    fieldName: keyof FormData
  ) => {
    const newIds = currentIds.includes(entityId)
      ? currentIds.filter((id) => id !== entityId)
      : [...currentIds, entityId];
    setIds(newIds);
    form.setFieldValue(fieldName, newIds);
  };

  useEffect(() => {
    if (selectedFAQ) {
      form.setFieldValue("question", selectedFAQ.question || "");
      form.setFieldValue("answer", selectedFAQ.answer || "");
      setIsGlobal(selectedFAQ.isGlobal || false);
      form.setFieldValue("isGlobal", selectedFAQ.isGlobal || false);

      const countries = selectedFAQ.countries || [];
      const initialCountryIds = countries
        .map(
          (r: { country?: { id: string }; countryId?: string }) =>
            r.country?.id || r.countryId || ""
        )
        .filter((id) => id !== "");
      setCountryIds(initialCountryIds);
      form.setFieldValue("countryIds", initialCountryIds);

      const destinations = selectedFAQ.destinations || [];
      const initialDestinationIds = destinations
        .map(
          (r: { destination?: { id: string }; destinationId?: string }) =>
            r.destination?.id || r.destinationId || ""
        )
        .filter((id) => id !== "");
      setDestinationIds(initialDestinationIds);
      form.setFieldValue("destinationIds", initialDestinationIds);

      const universities = selectedFAQ.universities || [];
      const initialUniversityIds = universities
        .map(
          (r: { university?: { id: string }; universityId?: string }) =>
            r.university?.id || r.universityId || ""
        )
        .filter((id) => id !== "");
      setUniversityIds(initialUniversityIds);
      form.setFieldValue("universityIds", initialUniversityIds);

      const events = selectedFAQ.events || [];
      const initialEventIds = events
        .map(
          (r: { event?: { id: string }; eventId?: string }) =>
            r.event?.id || r.eventId || ""
        )
        .filter((id) => id !== "");
      setEventIds(initialEventIds);
      form.setFieldValue("eventIds", initialEventIds);

      const courses = selectedFAQ.courses || [];
      const initialCourseIds = courses
        .map(
          (r: { course?: { id: string }; courseId?: string }) =>
            r.course?.id || r.courseId || ""
        )
        .filter((id) => id !== "");
      setCourseIds(initialCourseIds);
      form.setFieldValue("courseIds", initialCourseIds);

      const scholarships = selectedFAQ.scholarships || [];
      const initialScholarshipIds = scholarships
        .map(
          (r: { scholarship?: { id: string }; scholarshipId?: string }) =>
            r.scholarship?.id || r.scholarshipId || ""
        )
        .filter((id) => id !== "");
      setScholarshipIds(initialScholarshipIds);
      form.setFieldValue("scholarshipIds", initialScholarshipIds);

      const intakePages = selectedFAQ.intakePages || [];
      const initialIntakePageIds = intakePages
        .map(
          (r: { intakePage?: { id: string }; intakePageId?: string }) =>
            r.intakePage?.id || r.intakePageId || ""
        )
        .filter((id) => id !== "");
      setIntakePageIds(initialIntakePageIds);
      form.setFieldValue("intakePageIds", initialIntakePageIds);
    } else {
      form.reset();
      setCountryIds([]);
      setDestinationIds([]);
      setUniversityIds([]);
      setEventIds([]);
      setCourseIds([]);
      setScholarshipIds([]);
      setIntakePageIds([]);
      setIsGlobal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFAQ]);

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? "Edit FAQ" : "Add FAQ"}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.AppField name="question">
            {(field) => <field.Input label="Question" />}
          </form.AppField>
          <form.AppField name="answer">
            {(field) => <field.Textarea label="Answer" />}
          </form.AppField>

          <form.AppField name="isGlobal">
            {(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isGlobal"
                  checked={isGlobal}
                  onCheckedChange={(checked) => {
                    setIsGlobal(checked === true);
                    field.handleChange(checked === true);
                  }}
                />
                <Label
                  htmlFor="isGlobal"
                  className="text-sm font-medium cursor-pointer"
                >
                  Show on Home Page (Global FAQ)
                </Label>
              </div>
            )}
          </form.AppField>

          {/* Entity Associations - Tabbed Interface */}
          <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Entity Associations</h3>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>Countries: {countryIds.length}</span>
                <span>•</span>
                <span>Destinations: {destinationIds.length}</span>
                <span>•</span>
                <span>Universities: {universityIds.length}</span>
                <span>•</span>
                <span>Events: {eventIds.length}</span>
                <span>•</span>
                <span>Courses: {courseIds.length}</span>
                <span>•</span>
                <span>Scholarships: {scholarshipIds.length}</span>
                <span>•</span>
                <span>Intake Pages: {intakePageIds.length}</span>
              </div>
            </div>
            <Tabs defaultValue="countries" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 h-auto">
                <TabsTrigger value="countries" className="text-xs">
                  Countries
                  {countryIds.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-4 px-1 text-xs"
                    >
                      {countryIds.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="destinations" className="text-xs">
                  Destinations
                  {destinationIds.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-4 px-1 text-xs"
                    >
                      {destinationIds.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="universities" className="text-xs">
                  Universities
                  {universityIds.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-4 px-1 text-xs"
                    >
                      {universityIds.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="events" className="text-xs">
                  Events
                  {eventIds.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-4 px-1 text-xs"
                    >
                      {eventIds.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="courses" className="text-xs">
                  Courses
                  {courseIds.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-4 px-1 text-xs"
                    >
                      {courseIds.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="scholarships" className="text-xs">
                  Scholarships
                  {scholarshipIds.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-4 px-1 text-xs"
                    >
                      {scholarshipIds.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="intakePages" className="text-xs">
                  Intake Pages
                  {intakePageIds.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-4 px-1 text-xs"
                    >
                      {intakePageIds.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="countries" className="mt-4">
                <form.AppField name="countryIds">
                  {(field) => (
                    <CountrySelect
                      value={countryIds}
                      onChange={(ids) => {
                        setCountryIds(ids);
                        field.handleChange(ids);
                      }}
                      label="Select Countries"
                    />
                  )}
                </form.AppField>
              </TabsContent>

              <TabsContent value="destinations" className="mt-4">
                {renderEntityList(
                  destinations,
                  destinationIds,
                  setDestinationIds,
                  "destinationIds",
                  searchDestinations,
                  setSearchDestinations,
                  "destination"
                )}
              </TabsContent>

              <TabsContent value="universities" className="mt-4">
                {renderEntityList(
                  universities,
                  universityIds,
                  setUniversityIds,
                  "universityIds",
                  searchUniversities,
                  setSearchUniversities,
                  "university"
                )}
              </TabsContent>

              <TabsContent value="events" className="mt-4">
                {renderEntityList(
                  events,
                  eventIds,
                  setEventIds,
                  "eventIds",
                  searchEvents,
                  setSearchEvents,
                  "event"
                )}
              </TabsContent>

              <TabsContent value="courses" className="mt-4">
                {renderEntityList(
                  courses,
                  courseIds,
                  setCourseIds,
                  "courseIds",
                  searchCourses,
                  setSearchCourses,
                  "course"
                )}
              </TabsContent>

              <TabsContent value="scholarships" className="mt-4">
                {renderEntityList(
                  scholarships,
                  scholarshipIds,
                  setScholarshipIds,
                  "scholarshipIds",
                  searchScholarships,
                  setSearchScholarships,
                  "scholarship"
                )}
              </TabsContent>

              <TabsContent value="intakePages" className="mt-4">
                {renderEntityList(
                  intakePages,
                  intakePageIds,
                  setIntakePageIds,
                  "intakePageIds",
                  searchIntakePages,
                  setSearchIntakePages,
                  "intakePage"
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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
        </FieldGroup>
      </form>
    </Modal>
  );
};

export default FAQFormModal;
