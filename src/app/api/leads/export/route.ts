import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "csv";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build where clause for date filtering
    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        // Add one day to include the entire end date
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        country: { select: { name: true } },
        destination: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (format === "csv") {
      // Generate CSV
      const headers = [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Country",
        "Destination",
        "Interest Data",
        "Created At",
      ];

      const rows = leads.map((lead) => [
        lead.id,
        lead.name || "",
        lead.email || "",
        lead.phone || "",
        lead.country?.name || "",
        lead.destination?.name || "",
        lead.interestJson ? JSON.stringify(lead.interestJson) : "",
        lead.createdAt.toISOString(),
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="leads-${
            new Date().toISOString().split("T")[0]
          }.csv"`,
        },
      });
    }

    // JSON format
    return NextResponse.json({ data: leads });
  } catch (error) {
    console.error("Error exporting leads:", error);
    return NextResponse.json(
      { error: "Failed to export leads" },
      { status: 500 }
    );
  }
}
