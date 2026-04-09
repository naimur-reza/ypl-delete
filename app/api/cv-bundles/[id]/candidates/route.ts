import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { requireAuth, requireRole } from "@/lib/api-auth";
import CvBundle from "@/lib/models/cv-bundle";
import SalaryGuideLead from "@/lib/models/salary-guide-lead";
import Activity from "@/lib/models/activity";
import { updateBundleCandidatesSchema } from "@/schemas/cv-bundle";

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const forbidden = requireRole(auth, ["superadmin", "admin"]);
  if (forbidden) return forbidden;

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = updateBundleCandidatesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await CvBundle.findById(id).lean();
    if (!existing || (existing as any).deletedAt) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const now = new Date();

    const ops = parsed.data.updates.map((u) => ({
      updateOne: {
        filter: { _id: id, deletedAt: { $exists: false } },
        update: {
          $set: {
            "candidates.$[c].status": u.status,
            "candidates.$[c].statusUpdatedAt": now,
          },
        },
        arrayFilters: [{ "c.leadId": new mongoose.Types.ObjectId(u.leadId) }],
      },
    }));

    if (ops.length) {
      await CvBundle.bulkWrite(ops as any, { ordered: false });
    }

    if (parsed.data.updates.length) {
      const leadOps = parsed.data.updates.map((u) => ({
        updateOne: {
          filter: { _id: u.leadId },
          update: { $set: { status: u.status } },
        },
      }));
      await SalaryGuideLead.bulkWrite(leadOps as any, { ordered: false });
    }

    const latest = await CvBundle.findById(id).lean();
    if (latest) {
      await CvBundle.updateOne(
        { _id: id },
        {
          $set: {
            status: aggregateBundleStatus((latest as any).candidates || []),
          },
        }
      );
    }

    await Activity.create({
      userId: auth.id,
      userName: auth.name || "Admin",
      userEmail: auth.email,
      action: "update",
      entityType: "CvBundle",
      entityId: id,
      entityName: (existing as any).bundleName,
      description: `Updated ${parsed.data.updates.length} candidate status(es) in bundle ${(existing as any).bundleName}`,
    }).catch((err) => console.error("[Activity Log Error]", err));

    const bundle = await CvBundle.findById(id).lean();
    return NextResponse.json(bundle);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

