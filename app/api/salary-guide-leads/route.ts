import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SalaryGuideLead from "@/lib/models/salary-guide-lead";
import { requireAuth } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const leads = await SalaryGuideLead.find().sort({ submittedAt: -1 }).lean();
  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  // Public endpoint — salary guide form submission (CV uploaded to Cloudinary client-side)
  try {
    const body = await req.json();
    await connectDB();

    const data: Record<string, string> = {};
    const fields = [
      "fullName", "email", "mobileNumber", "professionalQualification",
      "educationalQualification", "totalExperience", "currentPosition",
      "department", "role", "currentOrganization", "previousOrganizations",
      "industry", "currentSalary", "expectedSalary", "availableFromDate",
      "location", "cvUrl",
    ];

    for (const field of fields) {
      const val = body[field];
      if (val && typeof val === "string") data[field] = val;
    }

    if (!data.fullName || !data.email || !data.mobileNumber || !data.location) {
      return NextResponse.json({ error: "Full name, email, mobile, and location are required" }, { status: 400 });
    }

    const lead = await SalaryGuideLead.create(data);
    return NextResponse.json(lead, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
