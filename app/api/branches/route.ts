import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Branch from "@/lib/models/branch";
import { requireAuth, requireRole } from "@/lib/api-auth";
import { branchSchema } from "@/schemas/branch";

export async function GET() {
  await connectDB();
  const branches = await Branch.find().sort({ name: 1 }).lean();
  return NextResponse.json(branches);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const forbidden = requireRole(auth, ["superadmin", "admin"]);
  if (forbidden) return forbidden;

  const body = await req.json();
  const parsed = branchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  await connectDB();
  const branch = await Branch.create(parsed.data);
  return NextResponse.json(branch, { status: 201 });
}
