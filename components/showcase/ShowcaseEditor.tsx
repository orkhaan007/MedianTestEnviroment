"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Upload, X, Loader2, Save } from "lucide-react";

interface Showcase {
  id: string;
  name: string;
  image_url: string;
  description?: string;
  season?: string;
  created_at: string;
}

interface ShowcaseEditorProps {
  showcase: Showcase;
  onSuccess: () => void;
}

export default function ShowcaseEditor({ showcase, onSuccess }: ShowcaseEditorProps) {
  const [name, setName] = useState(showcase.name);
  const [season, setSeason] = useState(showcase.season || "");
  const [description, setDescription] = useState(showcase.description || "");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(showcase.image_url);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageChanged(true);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  const resetToOriginalImage = () => {
    setFile(null);
    setPreviewUrl(showcase.image_url);
    setImageChanged(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      setError("Please enter a showcase item name");
      return;
    }
    
    try {
      setUploading(true);
      setError(null);
      
      let imageUrl = showcase.image_url;
      
      // If image was changed, upload the new one
      if (imageChanged && file) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error("Please select an image file");
        }
        
        // Get Cloudinary credentials
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
        const uploadPreset = "gallery_uploads"; // Using the same preset as gallery
        
        // Create form data for upload - using unsigned upload preset
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("folder", "showcase"); // Store in showcase folder

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
        const uploadPromise = new Promise<string>((resolve, reject) => {
          xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
          
          xhr.onload = () => {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              resolve(response.secure_url);
            } else {
              reject(new Error("Upload failed"));
            }
          };
          
          xhr.onerror = () => {
            reject(new Error("Network error during upload"));
          };
          
          xhr.send(formData);
        });
        
        // Wait for the upload to complete
        imageUrl = await uploadPromise;
      }
      
      // Update showcase data in database
      const { error: dbError } = await supabase
        .from("jerseys")
        .update({
          name,
          image_url: imageUrl,
          description: description || null,
          season: season || null,
        })
        .eq("id", showcase.id);
        
      if (dbError) {
        throw new Error(`Error updating showcase data: ${dbError.message}`);
      }
      
      // Notify parent component
      onSuccess();
      
    } catch (err: any) {
      setError(err.message);
      console.error("Error updating showcase item:", err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (imageChanged && previewUrl !== showcase.image_url) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [imageChanged, previewUrl, showcase.image_url]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Item Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Showcase Item Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="season" className="block text-sm font-medium text-gray-700 mb-1">
              Season
            </label>
            <input
              type="text"
              id="season"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              placeholder="2023-2024"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter item description..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              Item Image
            </label>
            {imageChanged && (
              <button
                type="button"
                onClick={resetToOriginalImage}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Reset to original
              </button>
            )}
          </div>
          
          <div className="relative border border-gray-200 rounded-lg overflow-hidden h-64">
            <img
              src={previewUrl}
              alt="Showcase item preview"
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-2 right-2 flex space-x-2">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <label
                htmlFor="file"
                className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 cursor-pointer"
              >
                <Upload className="h-5 w-5 text-gray-600" />
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={uploading}
          className={`px-6 py-2 bg-[#0ed632] text-white rounded-md hover:bg-[#0bc02c] transition-colors flex items-center ${
            uploading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              {imageChanged && uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : "Saving..."}
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
