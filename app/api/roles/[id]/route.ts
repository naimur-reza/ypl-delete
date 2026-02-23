import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Role from "@/lib/models/role";
import { requireAuth } from "@/lib/api-auth";
import { roleSchema } from "@/schemas/role";

export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { _id, ...updateData } = body;
    
    if (!_id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const parsed = roleSchema.safeParse(updateData);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    await connectDB();
    const role = await Role.findByIdAndUpdate(_id, parsed.data, { new: true });
    if (!role) return NextResponse.json({ error: "Role not found" }, { status: 404 });

    return NextResponse.json(role);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await connectDB();
    const role = await Role.findByIdAndDelete(id);
    if (!role) return NextResponse.json({ error: "Role not found" }, { status: 404 });

    return NextResponse.json({ message: "Role deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
