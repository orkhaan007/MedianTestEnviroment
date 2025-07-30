"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import RefreshableGallery from "./RefreshableGallery";
import VideoGallery from "./VideoGallery";

interface MediaTabsProps {
  images: any[];
  videos: any[];
  currentUser: any;
  pageTitle: string;
  isMyUploads?: boolean;
}

export default function MediaTabs({ 
  images, 
  videos, 
  currentUser, 
  pageTitle,
  isMyUploads = false
}: MediaTabsProps) {
  const [activeTab, setActiveTab] = useState('images');
  
  // Function to switch between tabs
  const switchTab = (tabId: string) => {
    setActiveTab(tabId);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-800">{pageTitle}</h1>
        </div>
        
        {currentUser ? (
          <Link 
            href="/media/upload" 
            className="bg-[#0ed632] hover:bg-[#0bc52c] text-white py-2 px-4 rounded-md inline-flex items-center transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Upload Media
          </Link>
        ) : (
          <Link 
            href="/sign-in" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md inline-flex items-center"
          >
            Sign in to upload
          </Link>
        )}
      </div>
      
      <div className="mb-6 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2">
            <button 
              onClick={() => switchTab('images')} 
              className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'images' ? 'border-[#0ed632] text-[#0ed632]' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
            >
              Images ({images.length})
            </button>
          </li>
          <li className="mr-2">
            <button 
              onClick={() => switchTab('videos')} 
              className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'videos' ? 'border-[#0ed632] text-[#0ed632]' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
            >
              Videos ({videos.length})
            </button>
          </li>
        </ul>
      </div>
      
      {activeTab === 'images' && (
        <Suspense fallback={<div>Loading images...</div>}>
          {images.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p className="mt-4 text-xl font-medium text-gray-500">
                {isMyUploads ? "You haven't uploaded any images yet" : "No images have been shared yet"}
              </p>
              {currentUser && (
                <>
                  <p className="mt-2 text-gray-500">
                    {isMyUploads ? "Get started by uploading your first image" : "Be the first to share an image"}
                  </p>
                  <Link 
                    href="/media/upload" 
                    className="mt-6 inline-block bg-[#0ed632] hover:bg-[#0bc52c] text-white py-2 px-6 rounded-md transition-colors"
                  >
                    Upload Image
                  </Link>
                </>
              )}
            </div>
          ) : (
            <RefreshableGallery 
              initialImages={images} 
              currentUserId={currentUser?.id}
            />
          )}
        </Suspense>
      )}
      
      {activeTab === 'videos' && (
        <Suspense fallback={<div>Loading videos...</div>}>
          {videos.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              <p className="mt-4 text-xl font-medium text-gray-500">
                {isMyUploads ? "You haven't uploaded any videos yet" : "No videos have been shared yet"}
              </p>
              {currentUser && (
                <>
                  <p className="mt-2 text-gray-500">
                    {isMyUploads ? "Get started by uploading your first video" : "Be the first to share a video"}
                  </p>
                  <Link 
                    href="/media/upload" 
                    className="mt-6 inline-block bg-[#0ed632] hover:bg-[#0bc52c] text-white py-2 px-6 rounded-md transition-colors"
                  >
                    Upload Video
                  </Link>
                </>
              )}
            </div>
          ) : (
            <VideoGallery 
              videos={videos} 
              currentUser={currentUser}
            />
          )}
        </Suspense>
      )}
    </div>
  );
}
