"use client";

import { useState, useRef } from "react";
import { createMedia } from "@/utils/gallery/db";
import { MediaType } from "@/types/gallery";

interface MediaUploaderProps {
  userEmail: string;
  userId: string;
  onUploadComplete?: () => void;
}

export default function MediaUploader({ userEmail, userId, onUploadComplete }: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [fileInputKey, setFileInputKey] = useState<number>(Date.now());
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Reset form fields when media type changes
  const handleMediaTypeChange = (type: MediaType) => {
    // Only reset if changing to a different type
    if (type !== mediaType) {
      setMediaType(type);
      // Reset form fields
      setError(null);
      setSuccess(null);
      setTitle("");
      setDescription("");
      setYoutubeUrl("");
      
      // Reset file input by changing its key
      setFileInputKey(Date.now());
    }
  };

  // Function to extract YouTube video ID from various YouTube URL formats
  const extractYoutubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Function to validate YouTube URL
  const isValidYoutubeUrl = (url: string): boolean => {
    return !!extractYoutubeVideoId(url);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccess(null);
    
    try {
      setIsUploading(true);
      
      // Handle YouTube link upload
      if (mediaType === "youtube") {
        if (!youtubeUrl) {
          setError("Please enter a YouTube URL");
          setIsUploading(false);
          return;
        }
        
        if (!isValidYoutubeUrl(youtubeUrl)) {
          setError("Please enter a valid YouTube URL");
          setIsUploading(false);
          return;
        }
        
        const videoId = extractYoutubeVideoId(youtubeUrl);
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        
        // Save YouTube video data
        await createMedia({
          url: embedUrl,
          title: title || "YouTube Video",
          description,
          user_email: userEmail,
          user_id: userId,
          media_type: "youtube"
        });
        
        // Reset form
        setTitle("");
        setDescription("");
        setYoutubeUrl("");
        
        setSuccess("YouTube video added successfully!");
        
        // Notify parent component
        if (onUploadComplete) {
          onUploadComplete();
        }
        
        setIsUploading(false);
        return;
      }
      
      // Handle file uploads (image or video)
      if (!fileInputRef.current?.files?.[0]) {
        setError(`Please select a ${mediaType} to upload`);
        setIsUploading(false);
        return;
      }

      const file = fileInputRef.current.files[0];
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        setIsUploading(false);
        return;
      }
      
      // Get Cloudinary credentials
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
      const uploadPreset = "gallery_uploads"; // Create this unsigned upload preset in your Cloudinary dashboard
      
      // Create form data for upload - using unsigned upload preset
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "gallery"); // Store in a gallery folder

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
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/${mediaType}/upload`);
        
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
      
      // Save media data to Supabase
      await createMedia({
        url: cloudinaryResponse.secure_url,
        title: title || file.name,
        description,
        user_email: userEmail,
        user_id: userId,
        media_type: mediaType
      });

      // Reset form
      setTitle("");
      setDescription("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      setSuccess(`${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} uploaded successfully!`);
      
      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : `Failed to upload ${mediaType}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-green-800">Upload Media</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => handleMediaTypeChange("image")}
            className={`px-4 py-2 rounded-md ${
              mediaType === "image" 
                ? "bg-green-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Image
          </button>
          <button
            type="button"
            onClick={() => handleMediaTypeChange("youtube")}
            className={`px-4 py-2 rounded-md ${
              mediaType === "youtube" 
                ? "bg-green-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            YouTube
          </button>
        </div>
      </div>
      
      <form onSubmit={handleUpload} className="space-y-4">
        {mediaType === "youtube" ? (
          <div>
            <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-1">
              YouTube URL
            </label>
            <input
              type="text"
              id="youtube-url"
              value={youtubeUrl || ""}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
          </div>
        ) : (
          <div>
            <label htmlFor="media" className="block text-sm font-medium text-gray-700 mb-1">
              Select Image
            </label>
            <input
              key={fileInputKey}
              type="file"
              id="media"
              ref={fileInputRef}
              accept="image/*"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              required
            />
          </div>
        )}
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title (optional)
          </label>
          <input
            type="text"
            id="title"
            value={title || ""}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder={`${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} title`}
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description || ""}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
            placeholder={`${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} description`}
          />
        </div>
        
        {isUploading && mediaType !== "youtube" && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isUploading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isUploading ? "Uploading..." : `Upload ${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}`}
        </button>
      </form>
    </div>
  );
}
