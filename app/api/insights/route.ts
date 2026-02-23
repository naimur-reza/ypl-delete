import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Insight from "@/lib/models/insight";
import { requireAuth } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "true";
    const category = searchParams.get("category");
    
    let query: any = activeOnly ? { isActive: true } : {};
    if (category && category !== "All") {
      query.category = category;
    }
    
    const insights = await Insight.find(query).sort({ order: 1, publishedAt: -1 });

    return NextResponse.json(insights);
  } catch (error: any) {
    console.error("GET /api/insights error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectDB();
    const body = await req.json();
    const insight = await Insight.create(body);
    return NextResponse.json(insight, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/insights error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
