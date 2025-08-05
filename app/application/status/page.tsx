"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import ApplicationStatus from "@/components/application/ApplicationStatus";

export default function ApplicationStatusPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/sign-in?next=/application/status");
          return;
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ed632]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <ApplicationStatus />
    </div>
  );
}
