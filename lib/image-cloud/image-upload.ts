import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export interface UploadedImage {
  url: string;
  publicId: string;
}

export const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>,
  currentImage: UploadedImage | null,
  setCurrentImage: Dispatch<SetStateAction<UploadedImage | null>>,
  setUploading: Dispatch<SetStateAction<boolean>>,
  bookId?: string
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    toast.error("Only JPG, JPEG, and PNG files are allowed");
    return;
  }

  // Validate file size (4MB = 4 * 1024 * 1024 bytes)
  const maxSize = 4 * 1024 * 1024;
  if (file.size > maxSize) {
    toast.error("File size must be less than 4MB");
    return;
  }

  setUploading(true);
  const data = new FormData();
  data.append("file", file);

  // If bookId is provided, use PATCH to update and delete old image in one call
  if (bookId) {
    if (currentImage?.publicId) {
      data.append("oldPublicId", currentImage.publicId);
    }
    data.append("bookId", bookId);

    try {
      const response = await fetch("/api/books/cover", {
        method: "PATCH",
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        setCurrentImage({
          url: result.imageUrl,
          publicId: result.publicId,
        });
        toast.success("Image updated successfully!");
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Update failed");
    } finally {
      setUploading(false);
    }
  } else {
    // For new books, delete old image in state before uploading new one
    if (currentImage?.publicId) {
      try {
        await fetch("/api/books/cover", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: currentImage.publicId }),
        });
      } catch (error) {
        console.error("Failed to delete old image:", error);
      }
    }

    try {
      const response = await fetch("/api/books/cover", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        setCurrentImage({
          url: result.imageUrl,
          publicId: result.publicId,
        });
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }
};

export const handleDeleteImage = async (
  currentImage: UploadedImage | null,
  setCurrentImage: Dispatch<SetStateAction<UploadedImage | null>>
) => {
  if (!currentImage) return;

  try {
    await fetch("/api/books/cover", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId: currentImage.publicId }),
    });

    setCurrentImage(null);
    toast.success("Image deleted");
  } catch (error) {
    console.error("Failed to delete image:", error);
    toast.error("Delete failed");
  }
};
