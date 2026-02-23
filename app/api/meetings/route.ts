import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Meeting from "@/lib/models/meeting";
import { meetingSchema } from "@/schemas/meeting";
import { requireAuth } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const meetings = await Meeting.find({}).sort({ startTime: 1 }).lean();
  return NextResponse.json(meetings);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const parsed = meetingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    await connectDB();
    const meeting = await Meeting.create(parsed.data);
    return NextResponse.json(meeting, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
