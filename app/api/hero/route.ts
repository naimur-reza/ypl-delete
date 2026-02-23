import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Hero from "@/lib/models/hero";
import { requireAuth, requireRole } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const onlyActive = searchParams.get("active") === "true";
  
  const query = onlyActive ? { isActive: true } : {};
  const heroes = await Hero.find(query).sort({ order: 1, createdAt: -1 }).lean();
  
  return NextResponse.json(heroes);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const forbidden = requireRole(auth, ["superadmin", "admin"]);
  if (forbidden) return forbidden;

  await connectDB();
  const body = await req.json();
  const hero = await Hero.create(body);
  
  return NextResponse.json(hero, { status: 201 });
}
