import { redirect } from "next/navigation";
import { checkAdminServerSide } from "@/utils/admin/serverAdminCheck";
import { getAllMediaAdmin } from "@/utils/admin/mediaAdmin";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import AdminMediaList from "@/components/admin/AdminMediaList";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  // Check if user is admin, redirects if not
  await checkAdminServerSide();
  
  // Fetch all media for admin view
  const mediaItems = await getAllMediaAdmin();
  
  // Filter media by type
  const images = mediaItems.filter(item => item.media_type === "image");
  const videos = mediaItems.filter(item => item.media_type === "youtube");
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link 
            href="/media/gallery" 
            className="text-green-600 hover:text-green-800 inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Gallery
          </Link>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Admin Content Management</h1>
            <p className="text-gray-600 mt-2">Manage all media content across the platform</p>
          </div>
          
          <Link 
            href="/admin/content/upload" 
            className="bg-[#0ed632] hover:bg-[#0bc52c] text-white py-2 px-4 rounded-md inline-flex items-center transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Upload New Media
          </Link>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Media Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600">Total Media Items</p>
              <p className="text-2xl font-bold text-green-800">{mediaItems.length}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">Images</p>
              <p className="text-2xl font-bold text-blue-800">{images.length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600">YouTube Videos</p>
              <p className="text-2xl font-bold text-purple-800">{videos.length}</p>
            </div>
          </div>
          
          <AdminMediaList mediaItems={mediaItems} />
        </div>
      </div>
    </Layout>
  );
}
