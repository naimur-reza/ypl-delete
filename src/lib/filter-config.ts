export const FILTER_TABS = [
  { id: "University", label: "University", badge: null },
  { id: "Course", label: "Courses", badge: null },
  { id: "Scholarships", label: "Scholarships", badge: null },
  { id: "Event", label: "Events", badge: null },
  { id: "Guide", label: "Guide Me", badge: "AI" },
  { id: "Offer", label: "Get instant offer", badge: null },
] as const;

export type FilterTabType = (typeof FILTER_TABS)[number]["id"];

export interface FilterOption {
  id: string;
  label: string;
  placeholder: string;
  type: "select" | "input"; // Type of input field
  dataSource?:
    | "destinations"
    | "countries"
    | "studyLevels"
    | "cities"
    | "months"
    | "eventTypes"; // API data source
  options?: string[]; // Static options (fallback)
  multiple?: boolean;
}

export interface FilterTabConfig {
  searchPlaceholder?: string; // Optional now, some tabs don't need search
  filters: FilterOption[];
  hasSearchButton?: boolean; // Whether to show search button
  showAsCard?: boolean; // For special layouts like "Get instant offer"
}

const FILTER_CONFIGS: Record<FilterTabType, FilterTabConfig> = {
  University: {
    hasSearchButton: true,
    filters: [
      {
        id: "uniName",
        label: "University Name",
        placeholder: "Enter university name",
        type: "input",
      },
    ],
  },
  Course: {
    hasSearchButton: true,
    filters: [
      {
        id: "courseSubject",
        label: "Course Subject",
        placeholder: "e.g., Law, Engineering, Business",
        type: "input",
      },
      {
        id: "studyLevel",
        label: "Study Level",
        placeholder: "Select study level",
        type: "select",
        dataSource: "studyLevels",
      },
      {
        id: "studyDestination",
        label: "Study Destination",
        placeholder: "Select study destination",
        type: "select",
        dataSource: "destinations",
      },
    ],
  },
  Scholarships: {
    hasSearchButton: true,
    filters: [
      {
        id: "studyLevel",
        label: "Study Level",
        placeholder: "Select study level",
        type: "select",
        dataSource: "studyLevels",
      },
      {
        id: "studyDestination",
        label: "Study Destination",
        placeholder: "Select study destination",
        type: "select",
        dataSource: "destinations",
      },
    ],
  },
  Event: {
    hasSearchButton: true,
    filters: [
      {
        id: "city",
        label: "City",
        placeholder: "Select city",
        type: "select",
        dataSource: "cities",
      },
      {
        id: "month",
        label: "Month",
        placeholder: "Select month",
        type: "select",
        dataSource: "months",
      },
      {
        id: "studyDestination",
        label: "Study Destination",
        placeholder: "Select study destination",
        type: "select",
        dataSource: "destinations",
      },
    ],
  },
  Guide: {
    hasSearchButton: true,
    filters: [
      {
        id: "interests",
        label: "Your Interests",
        placeholder: "Select interests",
        type: "select",
        options: ["STEM", "Business", "Arts & Humanities", "Social Sciences"],
        multiple: true,
      },
      {
        id: "budget",
        label: "Budget",
        placeholder: "Select budget",
        type: "select",
        options: ["Budget-friendly", "Mid-range", "Premium"],
      },
    ],
  },
  Offer: {
    showAsCard: true,
    filters: [],
  },
};

export function getFilterConfig(tabId: FilterTabType): FilterTabConfig {
  return FILTER_CONFIGS[tabId];
}
