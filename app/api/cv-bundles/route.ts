import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth, requireRole } from "@/lib/api-auth";
import CvBundle from "@/lib/models/cv-bundle";
import SalaryGuideLead from "@/lib/models/salary-guide-lead";
import Activity from "@/lib/models/activity";
import { createCvBundleSchema } from "@/schemas/cv-bundle";

const statusRank: Record<string, number> = {
  New: 0,
  Contacted: 1,
  Qualified: 2,
  Converted: 3,
};

function aggregateBundleStatus(
  candidates: Array<{ status?: string }> = []
): "New" | "Contacted" | "Qualified" | "Converted" {
  let max = 0;
  for (const c of candidates) {
    const r = statusRank[c.status || "New"] ?? 0;
    if (r > max) max = r;
  }
  return (Object.keys(statusRank).find((k) => statusRank[k] === max) ||
    "New") as "New" | "Contacted" | "Qualified" | "Converted";
}

function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const forbidden = requireRole(auth, ["superadmin", "admin"]);
  if (forbidden) return forbidden;

  await connectDB();

  const url = new URL(req.url);
  const status = url.searchParams.get("status")?.trim() || "";
  const companyName = url.searchParams.get("companyName")?.trim() || "";
  const q = (url.searchParams.get("q") || url.searchParams.get("search") || "")
    .trim();

  const query: Record<string, any> = { deletedAt: { $exists: false } };

  if (status) query.status = status;
  if (companyName) query.companyName = new RegExp(escapeRegExp(companyName), "i");
  if (q) {
    const rx = new RegExp(escapeRegExp(q), "i");
    query.$or = [{ bundleName: rx }, { companyName: rx }];
  }

  const bundles = await CvBundle.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json(bundles);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const forbidden = requireRole(auth, ["superadmin", "admin"]);
  if (forbidden) return forbidden;

  try {
    const body = await req.json();
    const parsed = createCvBundleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();

    const leads = await SalaryGuideLead.find({
      _id: { $in: parsed.data.candidateIds },
    })
      .select("fullName email cvUrl department role status")
      .lean();

    if (leads.length !== parsed.data.candidateIds.length) {
      return NextResponse.json(
        { error: "One or more candidates were not found" },
        { status: 400 }
      );
    }

    const candidates = leads.map((lead: any) => ({
      leadId: lead._id,
      fullName: lead.fullName || "",
      email: lead.email || "",
      cvUrl: lead.cvUrl || "",
      department: lead.department || "",
      role: lead.role || "",
      status: lead.status || "New",
      statusUpdatedAt: new Date(),
    }));

    const bundle = await CvBundle.create({
      bundleName: parsed.data.bundleName,
      companyName: parsed.data.companyName,
      companyEmail: parsed.data.companyEmail || "",
      notes: parsed.data.notes || "",
      candidates,
      status: aggregateBundleStatus(candidates),
      createdBy: auth.id,
    });

    await Activity.create({
      userId: auth.id,
      userName: auth.name || "Admin",
      userEmail: auth.email,
      action: "create",
      entityType: "CvBundle",
      entityId: bundle._id.toString(),
      entityName: bundle.bundleName,
      description: `Created CV Bundle: ${bundle.bundleName}`,
    }).catch((err) => console.error("[Activity Log Error]", err));

    return NextResponse.json(bundle, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

