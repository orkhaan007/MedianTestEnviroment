"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft } from "lucide-react";
import Loading from "@/components/ui/Loading";
import JerseyEditor from "@/components/jerseys/JerseyEditor";

interface Jersey {
  id: string;
  name: string;
  image_url: string;
  description?: string;
  season?: string;
  created_at: string;
}

export default function EditJerseyPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [jersey, setJersey] = useState<Jersey | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const { id } = params;

  // Check if user is admin and fetch jersey data
  useEffect(() => {
    async function checkAdminAndFetchJersey() {
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
        
        // Fetch jersey data
        const { data: jerseyData, error: jerseyError } = await supabase
          .from("jerseys")
          .select("*")
          .eq("id", id)
          .single();
          
        if (jerseyError) {
          console.error("Error fetching jersey:", jerseyError);
          alert("Jersey not found");
          router.push("/admin/jerseys");
          return;
        }
        
        setJersey(jerseyData);
      } catch (error) {
        console.error("Error in checkAdminAndFetchJersey:", error);
        router.push("/admin/jerseys");
      } finally {
        setLoading(false);
      }
    }

    checkAdminAndFetchJersey();
  }, [id, router, supabase]);

  if (loading) {
    return <Loading />;
  }

  if (!isAdmin || !jersey) {
    return null; // This will never render because we redirect non-admins
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Link href="/admin/jerseys" className="mr-4">
          <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-[#0ed632]" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Jersey</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <JerseyEditor 
            jersey={jersey} 
            onSuccess={() => router.push("/admin/jerseys")} 
          />
        </div>
      </div>
    </div>
  );
}
