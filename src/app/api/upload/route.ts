/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return Response.json(
        { error: "File size too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Validate Supabase configuration
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return Response.json(
        {
          error:
            "Supabase URL is not configured. Please set NEXT_PUBLIC_SUPABASE_URL in your environment variables.",
        },
        { status: 500 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return Response.json(
        {
          error:
            "Supabase service role key is not configured. Please set SUPABASE_SERVICE_ROLE_KEY in your environment variables.",
        },
        { status: 500 }
      );
    }

    // Get folder from query params
    const folder = req.nextUrl.searchParams.get("folder") || "nwc-education";

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("images") // Your bucket name
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);

      // Handle specific Supabase errors
      if (
        error.message?.includes("JWT") ||
        error.message?.includes("API key")
      ) {
        return Response.json(
          {
            error:
              "Supabase authentication failed. Please check your SUPABASE_SERVICE_ROLE_KEY environment variable.",
          },
          { status: 500 }
        );
      }

      throw error;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath);

    return Response.json({
      url: publicUrl,
      publicId: data.path,
      path: data.path,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return Response.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
