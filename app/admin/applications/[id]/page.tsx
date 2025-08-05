"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { checkAdminServerSide } from "@/utils/admin/serverAdminCheck";
import AdminApplicationDetail from "@/components/admin/AdminApplicationDetail";
import { useParams } from "next/navigation";

interface Application {
  id: string;
  full_name: string;
  age: number;
  discord_nick: string;
  discord_id: string;
  steam_profile: string;
  fivem_hours: number;
  why_median: string;
  accept_warning_system: boolean;
  accept_ck_possibility: boolean;
  accept_hierarchy: boolean;
  southside_meaning: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
  admin_notes?: string;
}

export default function AdminApplicationDetailPage() {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const applicationId = params.id as string;
  const supabase = createClient();

  useEffect(() => {
    async function checkAdmin() {
      try {
        await checkAdminServerSide();
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    }

    checkAdmin();
  }, []);

  useEffect(() => {
    async function fetchApplicationDetail() {
      try {
        const { data, error } = await supabase
          .from("applications")
          .select("*")
          .eq("id", applicationId)
          .single();
        
        if (error) {
          throw error;
        }
        
        setApplication(data as Application);
      } catch (error) {
        console.error("Error fetching application details:", error);
        setError("An error occurred while retrieving application details");
      } finally {
        setLoading(false);
      }
    }
    
    if (applicationId) {
      fetchApplicationDetail();
    }
  }, [supabase, applicationId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ed632]"></div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">
              {error || "Application not found"}
            </p>
            <a
              href="/admin/applications"
              className="px-6 py-3 bg-[#0ed632] text-white font-medium rounded-md hover:bg-[#0bc02c] focus:outline-none focus:ring-2 focus:ring-[#0ed632] focus:ring-offset-2 transition-colors"
            >
              Return to Applications
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <AdminApplicationDetail application={application} />
    </div>
  );
}
