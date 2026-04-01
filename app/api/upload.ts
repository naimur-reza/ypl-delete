"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

type UploadOptions = {
  folder?: string;
  resourceType?: "auto" | "image" | "raw";
};

export async function uploadImage(formData: FormData, options?: UploadOptions) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const originalFileName = file.name;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options?.folder ?? "diverse-projects",
          resource_type: options?.resourceType ?? "auto",
          use_filename: true,
          unique_filename: true,
          filename_override: originalFileName,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      uploadStream.end(buffer);
    });

    return {
      success: true,
      data: {
        ...(result as Record<string, unknown>),
        original_filename: originalFileName,
      },
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/** Upload CV/document files (PDF, DOC, DOCX) to Cloudinary */
export async function uploadFile(
  formData: FormData,
  folder = "salary-guide-cvs",
) {
  return uploadImage(formData, {
    folder,
    resourceType: "auto",
  });
}
