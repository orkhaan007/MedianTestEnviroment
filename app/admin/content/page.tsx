"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Plus, ArrowLeft, Search } from "lucide-react";
import Loading from "@/components/ui/Loading";
import AdminMediaList from "@/components/admin/AdminMediaList";

import { MediaData } from "@/types/gallery";

export default function AdminContentPage() {
  const [loading, setLoading] = useState(true);
  const [mediaItems, setMediaItems] = useState<MediaData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const supabase = createClient();

  // Handle media deletion
  const handleMediaDeleted = (mediaId: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== mediaId));
  };

  // Fetch all media items
  useEffect(() => {
    async function fetchData() {
      try {
        // Check if user is admin
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/");
          return;
        }
        
        // Check if user is in admin_users table
        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", user.email)
          .single();
          
        if (adminError || !adminData) {
          router.push("/");
          return;
        }
        
        // Fetch all media
        const { data, error } = await supabase
          .from('images')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching media:", error);
          setMediaItems([]);
        } else {
          // Process data to extract media_type from description
          const processedData = data.map(item => {
            const description = item.description || "";
            let mediaType = 'image';
            let cleanDescription = description;
            
            // Extract media type from description if it exists
            const typeMatch = description.match(/^\[TYPE:(image|youtube)\](.*)$/);
            if (typeMatch) {
              mediaType = typeMatch[1];
              cleanDescription = typeMatch[2];
            } else if (item.url?.includes('youtube.com/embed/')) {
              mediaType = 'youtube';
            }
            
            return {
              ...item,
              description: cleanDescription,
              media_type: mediaType,
              user_email: item.user_email || ""
            };
          }) as MediaData[];
          
          setMediaItems(processedData);
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router, supabase]);
  
  // Filter media items based on search term
  const filteredMediaItems = mediaItems.filter(item => 
    (item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (item.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    item.media_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.user_email && item.user_email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Filter media by type
  const images = filteredMediaItems.filter(item => item.media_type === "image");
  const videos = filteredMediaItems.filter(item => item.media_type === "youtube");
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Link href="/admin" className="mr-4">
          <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-[#0ed632]" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
      </div>
      
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <Link 
          href="/admin/content/upload"
          className="flex items-center justify-center px-4 py-2 bg-[#0ed632] text-white rounded-md hover:bg-[#0bc02c] transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Upload New Media
        </Link>
      </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Media Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600">Total Media Items</p>
              <p className="text-2xl font-bold text-green-800">{filteredMediaItems.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600">Images</p>
              <p className="text-2xl font-bold text-green-800">{images.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600">YouTube Videos</p>
              <p className="text-2xl font-bold text-green-800">{videos.length}</p>
            </div>
          </div>
          
          <AdminMediaList mediaItems={filteredMediaItems} onMediaDeleted={handleMediaDeleted} />
        </div>
      </div>
  );
}
