import { NextRequest, NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import EventLead from "@/lib/models/event-lead";
import { requireAuth } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  try {
    const authError = await requireAuth(req);
    if (authError) return authError;

    await connectDB();
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    
    const query: any = {};
    if (eventId) query.eventId = eventId;

    const leads = await EventLead.find(query)
      .populate("eventId", "title")
      .sort({ createdAt: -1 })
      .lean();
      
    return NextResponse.json(leads);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Simple validation
    if (!body.eventId || !body.fullName || !body.email || !body.mobileNumber) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const lead = await EventLead.create(body);
    return NextResponse.json(lead, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
