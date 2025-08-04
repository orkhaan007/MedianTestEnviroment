"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { deleteMediaAdmin } from "@/utils/admin/mediaAdmin";
import { MediaData } from "@/types/gallery";
import { extractYoutubeVideoId, getYoutubeThumbnailUrl } from "@/utils/youtube";

interface AdminMediaListProps {
  mediaItems: MediaData[];
  onMediaDeleted: (mediaId: string) => void;
}

export default function AdminMediaList({ mediaItems, onMediaDeleted }: AdminMediaListProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  
  const filteredItems = activeTab === 'all' 
    ? mediaItems 
    : mediaItems.filter((item: MediaData) => item.media_type === activeTab);
  
  const handleDelete = async (mediaId: string) => {
    if (isDeleting) return;
    
    if (confirm("Are you sure you want to delete this media item?")) {
      try {
        setIsDeleting(mediaId);
        await deleteMediaAdmin(mediaId);
        
        // Call the callback to update the parent component's state
        onMediaDeleted(mediaId);
      } catch (error) {
        console.error("Error deleting media:", error);
        alert("Failed to delete media. Please try again.");
      } finally {
        setIsDeleting(null);
      }
    }
  };
  
  return (
    <div>
      <div className="mb-6 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2">
            <button 
              onClick={() => setActiveTab('all')} 
              className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'all' ? 'border-[#0ed632] text-[#0ed632]' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
            >
              All Media ({mediaItems.length})
            </button>
          </li>
          <li className="mr-2">
            <button 
              onClick={() => setActiveTab('image')} 
              className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'image' ? 'border-[#0ed632] text-[#0ed632]' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
            >
              Images ({mediaItems.filter((item: MediaData) => item.media_type === 'image').length})
            </button>
          </li>
          <li className="mr-2">
            <button 
              onClick={() => setActiveTab('youtube')} 
              className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'youtube' ? 'border-[#0ed632] text-[#0ed632]' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
            >
              YouTube Videos ({mediaItems.filter((item: MediaData) => item.media_type === 'youtube').length})
            </button>
          </li>
        </ul>
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p className="mt-4 text-xl font-medium text-gray-500">
            No media items found
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Media
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded By
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.media_type === 'image' ? (
                      <div className="w-20 h-20 relative">
                        <Image 
                          src={item.url} 
                          alt={item.title || 'Image'} 
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 relative">
                        {(() => {
                          const videoId = extractYoutubeVideoId(item.url);
                          const thumbnailUrl = videoId ? getYoutubeThumbnailUrl(videoId) : '';
                          return (
                            <>
                              <Image 
                                src={thumbnailUrl} 
                                alt={item.title || 'YouTube Video'} 
                                fill
                                className="object-cover rounded-md"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black bg-opacity-50 rounded-full p-2">
                                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                  </svg>
                                </div>
                              </div>
                            </>
                          );
                        })()} 
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.title || 'Untitled'}</div>
                    <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                      {item.description || 'No description'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{item.media_type === 'youtube' ? 'YouTube' : item.media_type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.user_details?.full_name || item.user_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.created_at).toISOString().split('T')[0]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <Link 
                        href={`/admin/content/edit/${item.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting === item.id}
                        className={`text-red-600 hover:text-red-900 ${isDeleting === item.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isDeleting === item.id ? (
                          <div className="h-5 w-5 animate-pulse">...</div>
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
