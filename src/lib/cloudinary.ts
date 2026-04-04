/**
 * Cloudinary Helper for Next.js 
 * Note: Browser-side uploads are typically done via unsigned presets or 
 * serverless functions. This helper provides the base configuration.
 */

export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "feeltech_unsigned");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    throw new Error("Cloudinary Cloud Name is not configured.");
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Failed to upload image to Cloudinary.");
  }

  const data = await response.json();
  return data.secure_url;
};
