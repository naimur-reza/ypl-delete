import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Insight from "@/lib/models/insight";
import { requireAuth } from "@/lib/api-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    // Check if ID is a valid MongoDB ObjectId or a slug
    const insight = mongoose.Types.ObjectId.isValid(id) 
      ? await Insight.findById(id)
      : await Insight.findOne({ slug: id });

    if (!insight) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    return NextResponse.json(insight);
  } catch (error: any) {
    console.error("GET /api/insights/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();
    
    delete body._id;
    
    const insight = await Insight.findByIdAndUpdate(id, body, { new: true });
    if (!insight) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    return NextResponse.json(insight);
  } catch (error: any) {
    console.error("PUT /api/insights/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    await connectDB();
    const insight = await Insight.findByIdAndDelete(id);
    if (!insight) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/insights/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Add this at the top to fix mongoose reference
import mongoose from "mongoose";
