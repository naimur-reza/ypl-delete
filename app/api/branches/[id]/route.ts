import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Branch from "@/lib/models/branch";
import { requireAuth, requireRole } from "@/lib/api-auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const branch = await Branch.findById(id).lean();
  if (!branch) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(branch);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const forbidden = requireRole(auth, ["superadmin", "admin"]);
  if (forbidden) return forbidden;
  const { id } = await params;

  const body = await req.json();
  await connectDB();
  const branch = await Branch.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!branch) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(branch);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const forbidden = requireRole(auth, ["superadmin", "admin"]);
  if (forbidden) return forbidden;
  const { id } = await params;

  await connectDB();
  await Branch.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
