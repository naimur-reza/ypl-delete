import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Hero from "@/lib/models/hero";
import { requireAuth, requireRole } from "@/lib/api-auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const forbidden = requireRole(auth, ["superadmin", "admin"]);
  if (forbidden) return forbidden;

  const { id } = await params;
  await connectDB();
  const body = await req.json();
  
  delete body._id; // Safety
  
  const hero = await Hero.findByIdAndUpdate(id, body, { new: true });
  if (!hero) return NextResponse.json({ error: "Not found" }, { status: 404 });
  
  return NextResponse.json(hero);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const forbidden = requireRole(auth, ["superadmin", "admin"]);
  if (forbidden) return forbidden;

  const { id } = await params;
  await connectDB();
  const hero = await Hero.findByIdAndDelete(id);
  if (!hero) return NextResponse.json({ error: "Not found" }, { status: 404 });
  
  return NextResponse.json({ success: true });
}
