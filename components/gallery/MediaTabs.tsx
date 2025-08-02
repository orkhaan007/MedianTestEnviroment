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
        
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-2">Admin-only uploads</p>
          <Link 
            href="/admin/content" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Admin Area
          </Link>
        </div>
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
              <p className="mt-2 text-gray-500">
                Media uploads are restricted to administrators only
              </p>
              <Link 
                href="/admin/content" 
                className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
              >
                Go to Admin Area
              </Link>
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
              <p className="mt-2 text-gray-500">
                Media uploads are restricted to administrators only
              </p>
              <Link 
                href="/admin/content" 
                className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
              >
                Go to Admin Area
              </Link>
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
