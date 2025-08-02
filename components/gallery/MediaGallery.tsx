"use client";

import { useState, useEffect } from "react";
import { MediaData } from "@/types/gallery";
import { formatDate } from "@/utils/date";

interface MediaGalleryProps {
  mediaItems: MediaData[];
  currentUserId?: string;
  onMediaDeleted?: () => void;
}

export default function MediaGallery({ mediaItems, currentUserId, onMediaDeleted }: MediaGalleryProps) {

  const filteredMedia = mediaItems.filter(item => item.media_type === 'image');

  const [selectedMedia, setSelectedMedia] = useState<MediaData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMediaClick = (media: MediaData) => {
    setSelectedMedia(media);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };




  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (filteredMedia.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No images have been shared yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {filteredMedia.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-xl text-gray-600">No images have been shared yet.</p>
          </div>
        ) : (
          filteredMedia.map((media) => (
            <div 
              key={media.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="aspect-video relative">
                <img
                  src={media.url}
                  alt={media.title || "Image"}
                  className="w-full h-full object-cover"
                  onClick={() => handleMediaClick(media)}
                />
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg truncate">{media.title || "Untitled Image"}</h3>
                </div>
                
                <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                  {media.description || "No description"}
                </p>
                
                <div className="mt-2 text-xs text-gray-500">
                  {media.created_at && (
                    <span>Added {new Date(media.created_at).toLocaleDateString()}</span>
                  )}
                </div>
                
                <button
                  onClick={() => handleMediaClick(media)}
                  className="mt-3 text-sm text-green-600 hover:text-green-800 font-medium"
                >
                  View fullscreen
                </button>
              </div>
            </div>
          ))
        )}
      </div>


      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium text-lg truncate pr-4">
                {selectedMedia.title || "Untitled Image"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="flex-grow overflow-auto p-4">
              <div className="flex items-center justify-center">
                <img 
                  src={selectedMedia.url}
                  alt={selectedMedia.title || "Image"}
                  className="max-h-[80vh] max-w-full object-contain"
                />
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">Description:</h4>
                <p className="mt-1 text-gray-600">{selectedMedia.description || "No description"}</p>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <p>Uploaded by: {selectedMedia.user_email}</p>
                  <p>Date: {new Date(selectedMedia.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              {error && (
                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
