import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SalaryGuideLead from "@/lib/models/salary-guide-lead";
import Activity from "@/lib/models/activity";
import { requireAuth } from "@/lib/api-auth";
import { parseExperienceYearBounds } from "@/lib/candidate-experience";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  await connectDB();

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() || "";
  const department = url.searchParams.get("department") || "";
  const role = url.searchParams.get("role") || "";
  const industry = url.searchParams.get("industry") || "";
  const location = url.searchParams.get("location") || "";
  const education = url.searchParams.get("education") || "";
  const professionalQualification =
    url.searchParams.get("professionalQualification") || "";
  const currentPosition = url.searchParams.get("currentPosition") || "";
  const availability = url.searchParams.get("availability") || "";
  const onlyExpired = url.searchParams.get("onlyExpired") === "true";
  const registrationFrom = url.searchParams.get("registrationFrom") || "";
  const registrationTo = url.searchParams.get("registrationTo") || "";
  const availableFrom = url.searchParams.get("availableFrom") || "";
  const availableTo = url.searchParams.get("availableTo") || "";
  const hasCv = url.searchParams.get("hasCv");
  const pageParam = Number(url.searchParams.get("page") || "");
  const limitParam = Number(url.searchParams.get("limit") || "");
  const ids = (url.searchParams.get("ids") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const usePagination = Number.isFinite(pageParam) || Number.isFinite(limitParam);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;
  const limit = Number.isFinite(limitParam) && limitParam > 0
    ? Math.min(Math.floor(limitParam), 200)
    : 50;

  const parseNum = (v: string | null) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : null; // ← add n > 0
  };

  const expMin = parseNum(url.searchParams.get("expMin"));
  const expMax = parseNum(url.searchParams.get("expMax"));
  const salaryMin = parseNum(url.searchParams.get("salaryMin"));
  const salaryMax = parseNum(url.searchParams.get("salaryMax"));

  const query: Record<string, any> = {};
  const searchClauses: object[] = [];

  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    searchClauses.push({
      $or: [
        { fullName: rx },
        { email: rx },
        { currentPosition: rx },
        { professionalQualification: rx },
        { currentOrganization: rx },
        { previousOrganizations: rx },
      ],
    });
  }
  if (hasCv === "false") {
    searchClauses.push({ $or: [{ cvUrl: { $exists: false } }, { cvUrl: "" }] });
  }
  if (searchClauses.length === 1) {
    Object.assign(query, searchClauses[0]);
  } else if (searchClauses.length > 1) {
    query.$and = searchClauses;
  }

  if (department) query.department = department;
  if (role) query.role = role;
  if (industry) query.industry = industry;
  if (location) query.location = location;
  if (education) query.educationalQualification = education;
  if (professionalQualification)
    query.professionalQualification = professionalQualification;
  if (currentPosition) query.currentPosition = currentPosition;
  if (availability) query.availableFromDate = availability;
  if (hasCv === "true") query.cvUrl = { $exists: true, $ne: "" };
  if (ids.length) query._id = { $in: ids };

  const leads = await SalaryGuideLead.find(query)
    .sort({ createdAt: -1, submittedAt: -1 })
    .lean();

  const parseComparableNumber = (value: string | undefined) => {
    if (!value) return null;
    const normalized = String(value).replace(/[^\d.]/g, "");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
  };

  const parseDate = (v: string | Date | undefined) => {
    if (!v) return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const isCvExpired = (lead: { createdAt?: Date; submittedAt?: Date }) => {
    const sourceDate = lead.createdAt || lead.submittedAt;
    if (!sourceDate) return false;
    const createdTime = new Date(sourceDate).getTime();
    if (Number.isNaN(createdTime)) return false;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return createdTime < sixMonthsAgo.getTime();
  };

  const filtered = leads.filter((lead: any) => {
    if (onlyExpired && !isCvExpired(lead)) return false;

    const createdRaw = lead.createdAt || lead.submittedAt;
    const created = createdRaw ? new Date(createdRaw) : null;
    const createdTime =
      created && !Number.isNaN(created.getTime()) ? created.getTime() : null;
    if (registrationFrom) {
      const fromTime = new Date(registrationFrom).getTime();
      if (createdTime === null || createdTime < fromTime) return false;
    }
    if (registrationTo) {
      const toDate = new Date(registrationTo);
      toDate.setHours(23, 59, 59, 999);
      const toTime = toDate.getTime();
      if (createdTime === null || createdTime > toTime) return false;
    }

    const expBounds =
      parseExperienceYearBounds(lead.totalExperience) ??
      (() => {
        const n = Number(String(lead.totalExperience).replace(/[^\d.]/g, ""));
        return Number.isFinite(n) && n >= 0 ? { low: n, high: n } : null;
      })();
    if (expMin !== null && (expBounds === null || expBounds.low < expMin))
      return false;
    if (expMax !== null && (expBounds === null || expBounds.high > expMax))
      return false;

    const salary = parseComparableNumber(lead.expectedSalary);
    if (salaryMin !== null && (salary === null || salary < salaryMin))
      return false;
    if (salaryMax !== null && (salary === null || salary > salaryMax))
      return false;

    const avDate = parseDate(lead.availableFromDate);
    if (availableFrom) {
      const from = new Date(availableFrom);
      if (avDate === null || avDate < from) return false;
    }
    if (availableTo) {
      const to = new Date(availableTo);
      if (avDate === null || avDate > to) return false;
    }

    return true;
  });
  const normalized = filtered.map((lead: any) => ({
    ...lead,
    createdAt: lead.createdAt || lead.submittedAt || null,
  }));
  if (!usePagination) return NextResponse.json(normalized);

  const total = normalized.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const data = normalized.slice(start, start + limit);

  return NextResponse.json({
    data,
    meta: {
      page: safePage,
      limit,
      total,
      totalPages,
      hasPrev: safePage > 1,
      hasNext: safePage < totalPages,
    },
  });
}

export async function POST(req: NextRequest) {
  // Public endpoint — salary guide form submission (CV uploaded to Cloudinary client-side)
  try {
    const body = await req.json();
    await connectDB();

    const data: Record<string, string> = {};
    const fields = [
      "fullName",
      "email",
      "mobileNumber",
      "professionalQualification",
      "educationalQualification",
      "totalExperience",
      "currentPosition",
      "department",
      "role",
      "currentOrganization",
      "previousOrganizations",
      "industry",
      "currentSalary",
      "expectedSalary",
      "availableFromDate",
      "location",
      "cvUrl",
    ];

    for (const field of fields) {
      const val = body[field];
      if (val && typeof val === "string") data[field] = val;
    }

    if (!data.fullName || !data.email || !data.mobileNumber || !data.location) {
      return NextResponse.json(
        { error: "Full name, email, mobile, and location are required" },
        { status: 400 },
      );
    }

    const lead = await SalaryGuideLead.create(data);

    // Get auth if available to log who created it (could be an admin adding it manually)
    const auth = await requireAuth(req);
    if (!(auth instanceof NextResponse)) {
      await Activity.create({
        userId: auth.id,
        userName: auth.name || "Admin", // Need to ensure name is in auth or fetch user
        userEmail: auth.email,
        action: "create",
        entityType: "SalaryGuideLead",
        entityId: lead._id,
        entityName: lead.fullName,
        description: `Created CV Lead for ${lead.fullName}`,
      });
    }

    return NextResponse.json(lead, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 },
    );
  }
}
