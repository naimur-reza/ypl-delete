import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Event from "@/lib/models/event";
import { eventSchema } from "@/schemas/event";
import { requireAuth } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const onlyActive = searchParams.get("active") === "true";
  const type = searchParams.get("type");
  
  const query: any = {};
  if (onlyActive) query.isActive = true;
  if (type) query.type = type;

  const events = await Event.find(query).sort({ startDate: 1 }).lean();
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const parsed = eventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    await connectDB();
    // In a real app, createdBy would come from the auth session
    const event = await Event.create({
      ...parsed.data,
      createdBy: (auth as any).user?.email || "admin",
    });
    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
