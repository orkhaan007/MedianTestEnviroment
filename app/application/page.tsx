"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import ApplicationForm from "@/components/application/ApplicationForm";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ApplicationPage() {
  const [loading, setLoading] = useState(true);
  const [hasExistingApplication, setHasExistingApplication] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/sign-in?next=/application");
          return;
        }
        
        // Check if user already has a pending application
        const { data: existingApplication } = await supabase
          .from("applications")
          .select("id, status")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);
        
        if (existingApplication && existingApplication.length > 0) {
          const application = existingApplication[0];
          if (application.status === "pending") {
            setHasExistingApplication(true);
            router.push("/application/status");
          }
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
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ed632]"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (hasExistingApplication) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <ApplicationForm />
      </div>
      <Footer />
    </>
  );
}
