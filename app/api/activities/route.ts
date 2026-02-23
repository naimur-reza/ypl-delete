import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Activity from "@/lib/models/activity";
import { requireAuth, requireRole } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  // Only admins can see activity logs
  const forbidden = requireRole(auth, ["superadmin", "admin"]);
  if (forbidden) return forbidden;

  await connectDB();
  const activities = await Activity.find().sort({ timestamp: -1 }).limit(100).lean();
  return NextResponse.json(activities);
}
