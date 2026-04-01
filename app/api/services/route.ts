import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/lib/models/service";
import { requireAuth } from "@/lib/api-auth";
import { serviceSchema } from "@/schemas/service";

export async function GET(req: NextRequest) {
  await connectDB();

  const url = new URL(req.url);
  const includeInactive = url.searchParams.get("includeInactive") === "1" || url.searchParams.get("includeInactive") === "true";

  const services = await Service.find(
    includeInactive ? {} : { isActive: true },
  )
    .sort({ order: 1 })
    .lean();
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  await connectDB();
  const service = await Service.create(parsed.data);
  return NextResponse.json(service, { status: 201 });
}
