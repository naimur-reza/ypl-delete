import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Application from "@/lib/models/application";
import { requireAuth } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const filter: any = {};

  const applications = await Application.find(filter)
    .populate("career", "title")
    .sort({ appliedAt: -1 })
    .lean();
  return NextResponse.json(applications);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();
  const application = await Application.create(body);
  return NextResponse.json(application, { status: 201 });
}
