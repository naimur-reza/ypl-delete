import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Setting from "@/lib/models/setting";
import { requireAuth } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  await connectDB();
  let setting = await Setting.findOne().lean();
  
  if (!setting) {
    // Upsert first setting if none exists
    setting = await Setting.create({
      siteName: "YPL",
      email: "info@ypl.com",
      phone: "+44 (0) 20 1234 5678",
      address: "123 Business Street, London, EC1A 1BB, United Kingdom",
      footerDescription: "Supporting the full talent lifecycle with expert recruitment and career management services.",
      socialLinks: [
        { platform: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin" },
        { platform: "Twitter", url: "https://twitter.com", icon: "Twitter" },
        { platform: "Facebook", url: "https://facebook.com", icon: "Facebook" },
      ],
    });
  }
  
  return NextResponse.json(setting);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  await connectDB();
  
  const setting = await Setting.findOneAndUpdate({}, body, {
    new: true,
    upsert: true,
  });
  
  return NextResponse.json(setting);
}
