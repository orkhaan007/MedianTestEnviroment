"use client";

import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";

interface ProfileImageUploaderProps {
  type: "avatar" | "banner";
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  className?: string;
}

export default function ProfileImageUploader({ 
  type, 
  currentImageUrl, 
  onImageUploaded,
  className = ""
}: ProfileImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    try {
      setError(null);
      setIsUploading(true);
      setUploadProgress(0);

      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Get Cloudinary credentials
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
      const uploadPreset = "profile_uploads"; // Create this unsigned upload preset in your Cloudinary dashboard
      
      // Get current user to create unique filename
      const supabaseClient = createClient();
      const { data: { user } } = await supabaseClient.auth.getUser();
      
      if (!user || !user.email) {
        throw new Error("User not authenticated or email not available");
      }
      
      // Create a unique filename using user email and timestamp
      const timestamp = new Date().getTime();
      const userEmailPart = user.email.split('@')[0]; // Get part before @ in email
      const uniqueFilename = `${userEmailPart}_${type}_${timestamp}`;
      
      // Create form data for upload - using unsigned upload preset
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("public_id", uniqueFilename); // Set custom public_id for the file
      
      // Store in appropriate folder based on type
      const folder = type === "avatar" ? "profile_photos" : "banners";
      formData.append("folder", folder);

      // Upload to Cloudinary with progress tracking
      const xhr = new XMLHttpRequest();
      
      // Set up progress tracking
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });
      
      // Create a promise to handle the XHR request
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(formData);
      });
      
      // Wait for upload to complete
      const cloudinaryResponse = await uploadPromise as { secure_url: string };
      
      // No need to extract public_id from current image URL since we're not deleting old images
      
      // Update user profile with the new image URL
      const fieldName = type === "avatar" ? "avatar_url" : "banner_url";
      
      const { error: updateError } = await supabaseClient.auth.updateUser({
        data: {
          [fieldName]: cloudinaryResponse.secure_url
        }
      });
      
      if (updateError) {
        throw updateError;
      }
      
      // Log the new image upload
      console.log(`New image uploaded with filename: ${uniqueFilename}`);
      
      // Call the callback with the new URL
      onImageUploaded(cloudinaryResponse.secure_url);
      
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <div 
        className={`relative ${type === "banner" ? "h-64 w-full" : "h-32 w-32"} overflow-hidden ${type === "banner" ? "" : "rounded-full"} cursor-pointer`}
        onClick={triggerFileInput}
      >
        {previewUrl ? (
          <>
            <img 
              src={previewUrl} 
              alt={type === "avatar" ? "Profile photo" : "Profile banner"} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium">Change {type === "avatar" ? "Photo" : "Banner"}</span>
            </div>
          </>
        ) : (
          type === "banner" ? (
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-[#0ed632] h-full w-full animate-gradient-x flex items-center justify-center">
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">Add Banner Image</span>
              </div>
            </div>
          ) : (
            <div className="bg-gray-200 h-full w-full flex items-center justify-center">
              <span className="text-4xl text-gray-400 font-bold">
                {currentImageUrl ? "" : "U"}
              </span>
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">Add Photo</span>
              </div>
            </div>
          )
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        id={type === "avatar" ? "avatar-uploader-input" : "banner-uploader-input"}
      />
      
      {isUploading && (
        <div className="mt-2">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-[#0ed632] rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 mt-1 text-center">{error}</p>
      )}
    </div>
  );
}
