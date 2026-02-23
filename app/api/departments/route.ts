import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Department from "@/lib/models/department";
import { requireAuth } from "@/lib/api-auth";
import { departmentSchema } from "@/schemas/department";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const onlyActive = searchParams.get("active") !== "false";
  
  const query = onlyActive ? { isActive: true } : {};
  const departments = await Department.find(query).sort({ order: 1, name: 1 }).lean();
  return NextResponse.json(departments);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const parsed = departmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    await connectDB();
    const department = await Department.create(parsed.data);
    return NextResponse.json(department, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Slug must be unique" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
