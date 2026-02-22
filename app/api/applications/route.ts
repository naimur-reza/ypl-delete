import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Application from "@/lib/models/application";
import { requireAuth } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const { searchParams } = req.nextUrl;
  const branch = searchParams.get("branch");
  const filter: any = {};
  if (branch) filter.branch = branch;
  if (auth.role === "manager" && auth.branch) {
    filter.branch = auth.branch;
  }

  const applications = await Application.find(filter)
    .populate("career", "title")
    .populate("branch", "name")
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
