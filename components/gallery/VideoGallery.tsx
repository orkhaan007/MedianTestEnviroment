"use client";

import { useState } from "react";
import { MediaData } from "@/types/gallery";
import { deleteMedia } from "@/utils/gallery/db";
import { formatDate } from "../../utils/date";


type User = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

interface VideoGalleryProps {
  videos: MediaData[];
  currentUser?: User | null;
}

export default function VideoGallery({ videos, currentUser }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<MediaData | null>(null);
  const [displayedVideos, setDisplayedVideos] = useState<MediaData[]>(videos);

  const handleDelete = async (id: string) => {
    const userId = currentUser?.id || '';

    if (confirm("Are you sure you want to delete this video?")) {
      try {
        await deleteMedia(id, userId);
        setDisplayedVideos((prevVideos) => prevVideos.filter((video) => video.id !== id));
        
        if (selectedVideo?.id === id) {
          setSelectedVideo(null);
        }
      } catch (error) {
        console.error("Error deleting video:", error);
        alert("Failed to delete video");
      }
    }
  };
  
  const extractYoutubeVideoId = (url: string) => {
    if (url.includes('/embed/')) {
      return url.split('/embed/')[1]?.split('?')[0];
    }
    return null;
  };
  
  return (
    <div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedVideos.map((video) => {
          const videoId = extractYoutubeVideoId(video.url);
          
          return (
            <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video relative">
                <iframe 
                  src={video.url} 
                  title={video.title || "YouTube video"}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg truncate">{video.title || "Untitled Video"}</h3>
                  
                  {currentUser && (
                    <button 
                      onClick={() => handleDelete(video.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                      aria-label="Delete video"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  )}
                </div>
                
                {video.description && (
                  <p className="text-gray-600 mt-1 text-sm line-clamp-2">{video.description}</p>
                )}
                
                <div className="mt-2 text-xs text-gray-500">
                  {video.created_at && (
                    <span>Added {formatDate(video.created_at)}</span>
                  )}
                </div>
                
                <button
                  onClick={() => setSelectedVideo(video)}
                  className="mt-3 text-sm text-green-600 hover:text-green-800 font-medium"
                >
                  Watch in fullscreen
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium text-lg truncate pr-4">
                {selectedVideo.title || "Untitled Video"}
              </h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="flex-grow overflow-auto p-4">
              <div className="aspect-video relative">
                <iframe 
                  src={selectedVideo.url} 
                  title={selectedVideo.title || "YouTube video"}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              
              {selectedVideo.description && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">Description:</h4>
                  <p className="mt-1 text-gray-600">{selectedVideo.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
