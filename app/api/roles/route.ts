import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Role from "@/lib/models/role";
import { requireAuth } from "@/lib/api-auth";
import { roleSchema } from "@/schemas/role";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const departmentId = searchParams.get("departmentId");
  const onlyActive = searchParams.get("active") !== "false";
  
  const query: any = {};
  if (departmentId) query.departmentId = departmentId;
  if (onlyActive) query.isActive = true;

  const roles = await Role.find(query).sort({ order: 1, name: 1 }).lean();
  return NextResponse.json(roles);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const parsed = roleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    await connectDB();
    const role = await Role.create(parsed.data);
    return NextResponse.json(role, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Role name must be unique within a department" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
