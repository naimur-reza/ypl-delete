import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Career from "@/lib/models/career";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  try {
    await connectDB();
    const careers = await Career.find()

    return NextResponse.json(careers);
  } catch (error: any) {
    console.error("GET /api/careers error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  await connectDB();
  const body = await req.json();
  if (!body.slug) body.slug = body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const career = await Career.create(body);
  return NextResponse.json(career, { status: 201 });
}
