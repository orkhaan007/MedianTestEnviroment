"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Upload } from "lucide-react";
import Loading from "@/components/ui/Loading";
import ShowcaseUploader from "@/components/showcase/ShowcaseUploader";

export default function AddShowcaseItemPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Check if user is admin
  useState(() => {
    async function checkAdminStatus() {
      try {
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
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    checkAdminStatus();
  });

  if (loading) {
    return <Loading />;
  }

  if (!isAdmin) {
    return null; // This will never render because we redirect non-admins
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Link href="/admin/showcase" className="mr-4">
          <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-[#0ed632]" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Showcase Item</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <ShowcaseUploader onSuccess={() => router.push("/admin/showcase")} />
        </div>
      </div>
    </div>
  );
}