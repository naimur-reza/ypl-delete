import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAuth, requireRole } from "@/lib/api-auth";
import CvBundle from "@/lib/models/cv-bundle";
import Activity from "@/lib/models/activity";
import { uploadInvoiceSchema } from "@/schemas/cv-bundle";

export async function POST(
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
    const parsed = uploadInvoiceSchema.safeParse(body);
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

    const update: Record<string, any> = {
      invoiceUrl: parsed.data.invoiceUrl,
      invoiceUploadedAt: now,
      status: "Converted",
    };

    const bundle = await CvBundle.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();

    await Activity.create({
      userId: auth.id,
      userName: auth.name || "Admin",
      userEmail: auth.email,
      action: "upload",
      entityType: "CvBundle",
      entityId: id,
      entityName: (existing as any).bundleName,
      description: `Invoice uploaded for bundle ${(existing as any).bundleName}`,
    }).catch((err) => console.error("[Activity Log Error]", err));

    return NextResponse.json(bundle);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

