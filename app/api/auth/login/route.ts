import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/user";
import { comparePasswords, signToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/schemas/login";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email: parsed.data.email, isActive: true });

    if (!user || !(await comparePasswords(parsed.data.password, user.password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      branch: user.branch?.toString(),
    });

    await setAuthCookie(token);

    return NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
