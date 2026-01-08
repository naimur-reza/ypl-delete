import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type - PDF and Word documents only
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        {
          error: "Invalid file type. Only PDF and Word documents are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB for resumes)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return Response.json(
        { error: "File size too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Validate Supabase configuration
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return Response.json(
        { error: "Supabase URL is not configured." },
        { status: 500 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return Response.json(
        { error: "Supabase service role key is not configured." },
        { status: 500 }
      );
    }

    // Generate unique filename with original extension
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const sanitizedName = file.name
      .replace(/\.[^/.]+$/, "") // Remove extension
      .replace(/[^a-zA-Z0-9]/g, "-") // Replace special chars with dash
      .substring(0, 50); // Limit length
    const fileName = `${Date.now()}-${sanitizedName}.${fileExt}`;
    const filePath = `resumes/${fileName}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage - using 'documents' bucket for resumes
    const { data, error } = await supabase.storage
      .from("documents")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);

      // Handle bucket not found error
      if (error.message?.includes("Bucket not found")) {
        return Response.json(
          {
            error:
              "Storage bucket 'documents' not found. Please create it in Supabase dashboard.",
          },
          { status: 500 }
        );
      }

      return Response.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("documents").getPublicUrl(data.path);

    return Response.json({
      url: publicUrl,
      path: data.path,
      fileName: file.name,
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    return Response.json(
      { error: "Failed to upload resume. Please try again." },
      { status: 500 }
    );
  }
}
