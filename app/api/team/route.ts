import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Team from "@/lib/models/team";
import { requireAuth } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "true";
    
    const query = activeOnly ? { isActive: true } : {};
    const team = await Team.find(query).sort({ order: 1, createdAt: -1 });

    return NextResponse.json(team);
  } catch (error: any) {
    console.error("GET /api/team error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectDB();
    const body = await req.json();
    const member = await Team.create(body);
    return NextResponse.json(member, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/team error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
