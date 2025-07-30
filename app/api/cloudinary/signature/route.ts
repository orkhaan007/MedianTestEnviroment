import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/utils/gallery/db";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary configuration missing" },
        { status: 500 }
      );
    }
    
    const signature = crypto
      .createHash('sha1')
      .update(`timestamp=${timestamp}${apiSecret}`)
      .digest('hex');
    
    return NextResponse.json({
      timestamp,
      signature,
      apiKey,
      cloudName
    });
  } catch (error) {
    console.error("Error generating signature:", error);
    return NextResponse.json(
      { error: "Failed to generate signature" },
      { status: 500 }
    );
  }
}
