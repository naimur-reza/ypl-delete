import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth, requireRole } from "@/lib/api-auth";
import CvBundle from "@/lib/models/cv-bundle";
import Activity from "@/lib/models/activity";
import { updateCvBundleSchema } from "@/schemas/cv-bundle";

async function getBundleOr404(id: string) {
  const bundle = await CvBundle.findById(id).lean();
  if (!bundle) return null;
  if ((bundle as any).deletedAt) return null;
  return bundle;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const forbidden = requireRole(auth, ["superadmin", "admin"]);
  if (forbidden) return forbidden;

  const { id } = await params;
  await connectDB();

  const bundle = await getBundleOr404(id);
  if (!bundle) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(bundle);
}

async function updateBundle(
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
    const parsed = updateCvBundleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await getBundleOr404(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const update: Record<string, any> = {};
    for (const key of [
      "bundleName",
      "companyName",
      "companyEmail",
      "status",
      "notes",
    ] as const) {
      if (key in parsed.data) update[key] = (parsed.data as any)[key];
    }

    if ("sentAt" in parsed.data) {
      const v = (parsed.data as any).sentAt;
      update.sentAt = v ? new Date(v) : null;
    }

    const bundle = await CvBundle.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();

    if (!bundle) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await Activity.create({
      userId: auth.id,
      userName: auth.name || "Admin",
      userEmail: auth.email,
      action: "update",
      entityType: "CvBundle",
      entityId: id,
      entityName: (bundle as any).bundleName,
      description: `Updated CV Bundle: ${(bundle as any).bundleName}`,
    }).catch((err) => console.error("[Activity Log Error]", err));

    return NextResponse.json(bundle);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  return updateBundle(req, ctx);
}

// Compatibility with existing `useCrud` which uses PUT for updates
export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  return updateBundle(req, ctx);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const forbidden = requireRole(auth, ["superadmin", "admin"]);
  if (forbidden) return forbidden;

  const { id } = await params;
  await connectDB();

  const url = new URL(req.url);
  const hard = url.searchParams.get("hard") === "true";

  const existing = await getBundleOr404(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (hard) {
    await CvBundle.deleteOne({ _id: id });
  } else {
    await CvBundle.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date(), deletedBy: auth.id } }
    );
  }

  await Activity.create({
    userId: auth.id,
    userName: auth.name || "Admin",
    userEmail: auth.email,
    action: "delete",
    entityType: "CvBundle",
    entityId: id,
    entityName: (existing as any).bundleName,
    description: `${hard ? "Hard" : "Soft"} deleted CV Bundle: ${(existing as any).bundleName}`,
  }).catch((err) => console.error("[Activity Log Error]", err));

  return NextResponse.json({ ok: true });
}

