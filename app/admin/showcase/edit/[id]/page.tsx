"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft } from "lucide-react";
import Loading from "@/components/ui/Loading";
import ShowcaseEditor from "@/components/showcase/ShowcaseEditor";
import { useParams } from "next/navigation";

interface Showcase {
  id: string;
  name: string;
  image_url: string;
  description?: string;
  season?: string;
  created_at: string;
}

export default function EditShowcaseItemPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showcase, setShowcase] = useState<Showcase | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const params = useParams();
  const id = params.id;

  // Check if user is admin and fetch showcase data
  useEffect(() => {
    async function checkAdminAndFetchShowcase() {
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
        
        setIsAdmin(true);
        
        // Fetch showcase data
        const { data: showcaseData, error: showcaseError } = await supabase
          .from("jerseys")
          .select("*")
          .eq("id", id)
          .single();
          
        if (showcaseError) {
          console.error("Error fetching showcase item:", showcaseError);
          alert("Showcase item not found");
          router.push("/admin/showcase");
          return;
        }
        
        setShowcase(showcaseData);
      } catch (error) {
        console.error("Error in checkAdminAndFetchShowcase:", error);
        router.push("/admin/showcase");
      } finally {
        setLoading(false);
      }
    }

    checkAdminAndFetchShowcase();
  }, [id, router, supabase]);

  if (loading) {
    return <Loading />;
  }

  if (!isAdmin || !showcase) {
    return null; // This will never render because we redirect non-admins
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Link href="/admin/showcase" className="mr-4">
          <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-[#0ed632]" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Showcase Item</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <ShowcaseEditor 
            showcase={showcase} 
            onSuccess={() => router.push("/admin/showcase")} 
          />
        </div>
      </div>
    </div>
  );
}
