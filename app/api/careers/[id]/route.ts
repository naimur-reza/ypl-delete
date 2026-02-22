import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Career from "@/lib/models/career";
import { requireAuth } from "@/lib/api-auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const career = await Career.findById(id).populate("branch", "name").lean();
    if (!career) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(career);
  } catch (error: any) {
    console.error("GET /api/careers/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  await connectDB();
  const body = await req.json();
  if (!body.branch) delete body.branch;
  const career = await Career.findByIdAndUpdate(id, body, { new: true });
  if (!career) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(career);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  await connectDB();
  await Career.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
