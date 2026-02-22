import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/user";
import { requireAuth, requireRole } from "@/lib/api-auth";
import { hashPassword } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;

  await connectDB();
  const user = await User.findById(id).select("-password").lean();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const forbidden = requireRole(auth, ["superadmin", "admin"]);
  if (forbidden) return forbidden;
  const { id } = await params;

  const body = await req.json();
  if (body.password) {
    body.password = await hashPassword(body.password);
  } else {
    delete body.password;
  }

  await connectDB();
  const user = await User.findByIdAndUpdate(id, body, { new: true }).select("-password").lean();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const forbidden = requireRole(auth, ["superadmin"]);
  if (forbidden) return forbidden;
  const { id } = await params;

  await connectDB();
  await User.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
