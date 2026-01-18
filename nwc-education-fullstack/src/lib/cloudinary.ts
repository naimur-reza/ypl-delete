/**
 * Cloudinary utility helpers
 * For image uploads, use the /api/upload route
 */

export function getCloudinaryImageUrl(
  url: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  }
): string {
  // If it's already a Cloudinary URL, apply transformations
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || !url.includes("cloudinary.com")) {
    return url;
  }

  // Extract public_id from URL if possible, or use full URL
  if (options) {
    const transforms: string[] = [];
    if (options.width) transforms.push(`w_${options.width}`);
    if (options.height) transforms.push(`h_${options.height}`);
    if (options.crop) transforms.push(`c_${options.crop}`);
    if (options.quality) transforms.push(`q_${options.quality}`);

    if (transforms.length > 0) {
      // Try to insert transformation into Cloudinary URL
      const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
      const urlParts = url.split("/upload/");
      if (urlParts.length === 2) {
        return `${baseUrl}/${transforms.join(",")}/${urlParts[1]}`;
      }
    }
  }

  return url;
}

/**
 * Extract public ID from Cloudinary URL
 */
export function extractPublicId(url: string): string | null {
  if (!url.includes("cloudinary.com")) return null;

  const parts = url.split("/upload/");
  if (parts.length === 2) {
    // Remove file extension if present
    return parts[1].split(".")[0];
  }

  return null;
}
