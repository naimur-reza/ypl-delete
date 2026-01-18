import { FilterOption } from "@/components/filters/reusable-filter";

interface Scholarship {
  id: string;
  title: string;
  amount?: number | null;
  deadline?: string | Date | null;
  destination?: {
    id: string;
    name: string;
  } | null;
  university?: {
    id: string;
    name: string;
  } | null;
}

// Parse amount to category
function parseAmountCategory(amount: number | null | undefined): string | null {
  if (!amount || amount <= 0) return null;

  if (amount < 5000) return "Under $5,000";
  if (amount < 10000) return "$5,000 - $10,000";
  if (amount < 25000) return "$10,000 - $25,000";
  if (amount < 50000) return "$25,000 - $50,000";
  return "$50,000+";
}

// Parse deadline status
function parseDeadlineStatus(
  deadline: string | Date | null | undefined
): string | null {
  if (!deadline) return null;

  const deadlineDate = new Date(deadline);
  const now = new Date();
  const daysUntil = Math.ceil(
    (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntil < 0) return "expired";
  if (daysUntil <= 30) return "closing_soon";
  if (daysUntil <= 90) return "within_3_months";
  return "more_than_3_months";
}

const DEADLINE_LABELS: Record<string, string> = {
  closing_soon: "Closing Soon (< 30 days)",
  within_3_months: "Within 3 Months",
  more_than_3_months: "3+ Months Away",
  expired: "Expired",
};

export function extractScholarshipFilterOptions(
  scholarships: Scholarship[]
): FilterOption[] {
  // Extract unique destinations with counts
  const destinationMap = new Map<string, { name: string; count: number }>();
  scholarships.forEach((scholarship) => {
    if (scholarship.destination) {
      const key = scholarship.destination.id;
      const existing = destinationMap.get(key);
      destinationMap.set(key, {
        name: scholarship.destination.name,
        count: (existing?.count || 0) + 1,
      });
    }
  });

  const destinationOptions = Array.from(destinationMap.entries())
    .map(([value, data]) => ({
      label: data.name,
      value,
      count: data.count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  // Extract unique universities with counts
  const universityMap = new Map<string, { name: string; count: number }>();
  scholarships.forEach((scholarship) => {
    if (scholarship.university) {
      const key = scholarship.university.id;
      const existing = universityMap.get(key);
      universityMap.set(key, {
        name: scholarship.university.name,
        count: (existing?.count || 0) + 1,
      });
    }
  });

  const universityOptions = Array.from(universityMap.entries())
    .map(([value, data]) => ({
      label: data.name,
      value,
      count: data.count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
    .slice(0, 50);

  // Extract amount categories with counts
  const amountMap = new Map<string, number>();
  scholarships.forEach((scholarship) => {
    const category = parseAmountCategory(scholarship.amount);
    if (category) {
      const count = amountMap.get(category) || 0;
      amountMap.set(category, count + 1);
    }
  });

  const amountOrder = [
    "Under $5,000",
    "$5,000 - $10,000",
    "$10,000 - $25,000",
    "$25,000 - $50,000",
    "$50,000+",
  ];
  const amountOptions = amountOrder
    .filter((a) => amountMap.has(a))
    .map((a) => ({
      label: a,
      value: a,
      count: amountMap.get(a) || 0,
    }));

  // Extract deadline status with counts
  const deadlineMap = new Map<string, number>();
  scholarships.forEach((scholarship) => {
    const status = parseDeadlineStatus(scholarship.deadline);
    if (status && status !== "expired") {
      const count = deadlineMap.get(status) || 0;
      deadlineMap.set(status, count + 1);
    }
  });

  const deadlineOrder = [
    "closing_soon",
    "within_3_months",
    "more_than_3_months",
  ];
  const deadlineOptions = deadlineOrder
    .filter((d) => deadlineMap.has(d))
    .map((d) => ({
      label: DEADLINE_LABELS[d],
      value: d,
      count: deadlineMap.get(d) || 0,
    }));

  // Build filter options array
  const filters: FilterOption[] = [];

  if (destinationOptions.length > 0) {
    filters.push({
      id: "destination",
      label: "Study Destination",
      options: destinationOptions,
    });
  }

  if (amountOptions.length > 0) {
    filters.push({
      id: "amount",
      label: "Award Amount",
      options: amountOptions,
    });
  }

  if (deadlineOptions.length > 0) {
    filters.push({
      id: "deadline",
      label: "Application Deadline",
      options: deadlineOptions,
    });
  }

  if (universityOptions.length > 0) {
    filters.push({
      id: "university",
      label: "University",
      options: universityOptions,
    });
  }

  return filters;
}

// Export utilities
export { parseAmountCategory, parseDeadlineStatus, DEADLINE_LABELS };
