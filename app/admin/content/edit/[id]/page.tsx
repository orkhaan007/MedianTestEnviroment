"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Loading from "@/components/ui/Loading";
import { useParams } from "next/navigation";
import { getMediaByIdAdmin, updateMediaAdmin } from "@/utils/admin/mediaAdmin";
import { MediaData } from "@/types/gallery";
import { extractYoutubeVideoId, getYoutubeThumbnailUrl } from "@/utils/youtube";

export default function EditMediaPage() {
  const router = useRouter();
  const params = useParams();
  const mediaId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [media, setMedia] = useState<MediaData | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMedia() {
      setIsLoading(true);
      try {
        const mediaData = await getMediaByIdAdmin(mediaId);
        if (mediaData) {
          setMedia(mediaData);
          setTitle(mediaData.title || "");
          setDescription(mediaData.description || "");
        } else {
          setError("Media not found");
        }
      } catch (err) {
        console.error("Error fetching media:", err);
        setError("Failed to load media");
      } finally {
        setIsLoading(false);
      }
    }

    if (mediaId) {
      fetchMedia();
    }
  }, [mediaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const updatedMedia = await updateMediaAdmin(mediaId, {
        title,
        description,
        media_type: media?.media_type // Keep the original media type
      });

      if (updatedMedia) {
        router.push("/admin/content");
      } else {
        setError("Failed to update media");
      }
    } catch (err) {
      console.error("Error updating media:", err);
      setError("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      </div>
    );
  }

  if (error && !media) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Link href="/admin/content" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Content Management
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Link href="/admin/content" className="mr-4">
          <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-[#0ed632]" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Media</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Media Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Media Info</h2>
          
          <div className="flex items-center mb-6">
            <div className="relative h-20 w-20 rounded-full overflow-hidden mr-4">
              {media?.media_type === 'image' ? (
                <Image 
                  src={media.url} 
                  alt={media.title || 'Image'} 
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full relative">
                  {(() => {
                    const videoId = extractYoutubeVideoId(media?.url || '');
                    const thumbnailUrl = videoId ? getYoutubeThumbnailUrl(videoId) : '';
                    return videoId ? (
                      <Image 
                        src={thumbnailUrl} 
                        alt={media?.title || 'YouTube Video'} 
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-green-600 via-[#0ed632] to-green-400">
                        <div className="text-xl text-white font-bold">Y</div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
            
            <div>
              <div className="font-medium text-xl text-gray-900">
                {media?.user_details?.full_name || 'User'}
              </div>
              <div className="text-gray-500">{media?.user_email}</div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Media Type</div>
                <div className="mt-1 text-lg font-medium text-gray-900 capitalize">{media?.media_type}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Upload Date</div>
                <div className="mt-1 text-lg font-medium text-gray-900">
                  {media?.created_at ? new Date(media.created_at).toLocaleDateString() : 'Unknown'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-md font-semibold text-gray-900 mb-3">Current Content</h3>
            
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-500">Title</div>
              <div className="mt-1 text-md text-gray-900">{media?.title || 'Untitled'}</div>
            </div>
            
            <div className="mb-2">
              <div className="text-sm font-medium text-gray-500">Description</div>
              <div className="mt-1 text-md text-gray-900 whitespace-pre-wrap overflow-auto max-h-32 break-words">
                {media?.description || 'No description provided'}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Media</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
                  required
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
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mt-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Information</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Only the title and description can be edited. Media type cannot be changed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/content"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-[#0ed632] text-white rounded-md hover:bg-[#0bc02c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
