import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SalaryGuideLead from "@/lib/models/salary-guide-lead";
import Activity from "@/lib/models/activity";
import { requireAuth } from "@/lib/api-auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const lead = await SalaryGuideLead.findById(id);
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  
  console.log(`[SalaryGuideLead API] PUT Request for ID: ${id}`);
  
  await connectDB();
  const body = await req.json();
  delete body._id; // Prevent Mongoose error if _id is in body
  const lead = await SalaryGuideLead.findByIdAndUpdate(id, body, { new: true });
  
  if (!lead) {
    console.error(`[SalaryGuideLead API] Lead NOT FOUND for ID: ${id}`);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await Activity.create({
    userId: auth.id,
    userName: auth.name || "Unknown Admin",
    userEmail: auth.email || "unknown@ypl.com",
    action: "update",
    entityType: "SalaryGuideLead",
    entityId: lead._id,
    entityName: lead.fullName,
    description: `Updated status/details for CV Lead: ${lead.fullName}`,
  }).catch(err => console.error("[Activity Log Error]", err));

  return NextResponse.json(lead);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;

  console.log(`[SalaryGuideLead API] DELETE Request for ID: ${id}`);

  await connectDB();
  const lead = await SalaryGuideLead.findById(id);
  
  if (!lead) {
    console.error(`[SalaryGuideLead API] Lead NOT FOUND for ID: ${id}`);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await Activity.create({
    userId: auth.id,
    userName: auth.name || "Unknown Admin",
    userEmail: auth.email || "unknown@ypl.com",
    action: "delete",
    entityType: "SalaryGuideLead",
    entityId: lead._id,
    entityName: lead.fullName,
    description: `Deleted CV Lead for ${lead.fullName}`,
  }).catch(err => console.error("[Activity Log Error]", err));

  await SalaryGuideLead.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
