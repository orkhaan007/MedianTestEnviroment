"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Edit, Trash2, Plus, ArrowLeft, Search } from "lucide-react";
import Loading from "@/components/ui/Loading";

interface Showcase {
  id: string;
  name: string;
  image_url: string;
  description?: string;
  season?: string;
  created_at: string;
}

export default function ShowcaseManagementPage() {
  const [loading, setLoading] = useState(true);
  const [showcaseItems, setShowcaseItems] = useState<Showcase[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const supabase = createClient();

  // Fetch jerseys and check admin status
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
        
        // Fetch showcase items
        const { data: showcaseData, error: showcaseError } = await supabase
          .from("jerseys")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (showcaseError) {
          console.error("Error fetching showcase items:", showcaseError);
        } else {
          setShowcaseItems(showcaseData || []);
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router, supabase]);

  // Filter showcase items based on search term
  const filteredShowcaseItems = showcaseItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.season && item.season.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Delete showcase item
  const deleteShowcaseItem = async (id: string) => {
    if (confirm("Are you sure you want to delete this showcase item?")) {
      try {
        const { error } = await supabase
          .from("jerseys")
          .delete()
          .eq("id", id);
          
        if (error) {
          console.error("Error deleting showcase item:", error);
          alert("Failed to delete showcase item");
        } else {
          // Update local state
          setShowcaseItems(prev => prev.filter(item => item.id !== id));
          alert("Showcase item deleted successfully");
        }
      } catch (error) {
        console.error("Error in deleteShowcaseItem:", error);
        alert("An error occurred while deleting the showcase item");
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Link href="/admin" className="mr-4">
          <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-[#0ed632]" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Showcase Management</h1>
      </div>
      
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search showcase items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <Link 
          href="/admin/showcase/add"
          className="flex items-center justify-center px-4 py-2 bg-[#0ed632] text-white rounded-md hover:bg-[#0bc02c] transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Showcase Item
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Season
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredShowcaseItems.length > 0 ? (
                filteredShowcaseItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={`${item.name}`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-200">
                            <div className="text-xl text-gray-500 font-bold">
                              N/A
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.season ? (
                        <span className="text-sm text-gray-700">
                          {item.season}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/admin/showcase/edit/${item.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button 
                          onClick={() => deleteShowcaseItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm ? "No showcase items found matching your search." : "No showcase items found. Add your first showcase item!"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}