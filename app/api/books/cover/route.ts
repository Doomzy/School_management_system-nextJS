import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import db from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "book-covers", // Organize in folders
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      success: true,
      imageUrl: (result as any).secure_url,
      publicId: (result as any).public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const bookId = formData.get("bookId") as string;
    const oldPublicId = formData.get("oldPublicId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!bookId) {
      return NextResponse.json(
        { error: "No bookId provided" },
        { status: 400 }
      );
    }

    // Delete old cover image if publicId is provided
    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload new cover to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "book-covers",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    // Update book with new cover image
    await db.book.update({
      where: { id: bookId },
      data: {
        coverImage: (result as any).secure_url,
        coverImagePublicId: (result as any).public_id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Image updated successfully",
      imageUrl: (result as any).secure_url,
      publicId: (result as any).public_id,
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { error: "No publicId provided" },
        { status: 400 }
      );
    }

    await cloudinary.uploader.destroy(publicId);

    await db.book.updateMany({
      where: { coverImagePublicId: publicId },
      data: { coverImage: null, coverImagePublicId: null },
    });

    return NextResponse.json({
      success: true,
      message: "Image deleted",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
