import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SalaryGuideLead from "@/lib/models/salary-guide-lead";
import { requireAuth } from "@/lib/api-auth";
import { sendSmtpMail } from "@/lib/email/smtp";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const candidateId = String(body?.candidateId || "").trim();
    const email = String(body?.email || "").trim();
    const fullName = String(body?.fullName || "").trim();

    if (!candidateId || !email || !fullName) {
      return NextResponse.json(
        { success: false, error: "candidateId, email, and fullName are required" },
        { status: 400 },
      );
    }

    await connectDB();
    const candidate = await SalaryGuideLead.findById(candidateId);
    if (!candidate) {
      return NextResponse.json(
        { success: false, error: "Candidate not found" },
        { status: 404 },
      );
    }

    const formUrl =
      process.env.CANDIDATE_CV_FORM_URL ||
      process.env.NEXT_PUBLIC_CANDIDATE_CV_FORM_URL ||
      `${req.nextUrl.origin}/submit-cv`;

    const subject = "Action Required: Please Update Your CV Profile";
    const text = `Dear ${fullName},

We noticed that your CV profile in our database is over 6 months old.
To ensure you are considered for the latest opportunities, we kindly request you to resubmit your updated CV at: ${formUrl}

Thank you for your time.

Regards,
The Recruitment Team`;

    await sendSmtpMail({ to: email, subject, text });

    await SalaryGuideLead.findByIdAndUpdate(candidateId, {
      $set: { lastNotifiedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to send notification" },
      { status: 500 },
    );
  }
}

