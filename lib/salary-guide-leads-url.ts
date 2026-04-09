const BASE = "/api/salary-guide-leads";

export type SalaryGuideLeadsListParams = {
  q?: string;
  department?: string;
  role?: string;
  industry?: string;
  location?: string;
  education?: string;
  professionalQualification?: string;
  currentPosition?: string;
  availability?: string;
  onlyExpired?: boolean;
  hasCv?: boolean;
  registrationFrom?: string;
  registrationTo?: string;
  expMin?: string;
  expMax?: string;
  page?: number;
  limit?: number;
};

/** Build GET URL for the salary-guide-leads list (admin filter + search). */
export function buildSalaryGuideLeadsListUrl(params: SalaryGuideLeadsListParams): string {
  const p = new URLSearchParams();

  const set = (key: string, value: string | undefined) => {
    if (value !== undefined && value !== "" && value !== "__all__") p.set(key, value);
  };

  set("q", params.q?.trim());
  set("department", params.department);
  set("role", params.role);
  set("industry", params.industry);
  set("location", params.location);
  set("education", params.education);
  set("professionalQualification", params.professionalQualification);
  set("currentPosition", params.currentPosition);
  set("availability", params.availability);

  if (params.onlyExpired) p.set("onlyExpired", "true");
  if (params.hasCv) p.set("hasCv", "true");
  set("registrationFrom", params.registrationFrom);
  set("registrationTo", params.registrationTo);

  set("expMin", params.expMin);
  set("expMax", params.expMax);
  if (params.page && Number.isFinite(params.page) && params.page > 0) {
    p.set("page", String(Math.floor(params.page)));
  }
  if (params.limit && Number.isFinite(params.limit) && params.limit > 0) {
    p.set("limit", String(Math.floor(params.limit)));
  }

  const qs = p.toString();
  return qs ? `${BASE}?${qs}` : BASE;
}
