import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Team from "@/lib/models/team";
import { requireAuth } from "@/lib/api-auth";

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
    
    // Prevent _id update error
    delete body._id;
    
    const member = await Team.findByIdAndUpdate(id, body, { new: true });
    if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    return NextResponse.json(member);
  } catch (error: any) {
    console.error("PUT /api/team/[id] error:", error);
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
    const member = await Team.findByIdAndDelete(id);
    if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/team/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
