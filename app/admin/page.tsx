"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/utils/team/db";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const admin = await isAdmin();
        setAuthorized(admin);
        if (!admin) {
          router.push("/");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ed632]"></div>
      </div>
    );
  }

  if (!authorized) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Management</h2>
          <p className="text-gray-600 mb-4">
            Manage team members, add new members from existing users, and edit member details.
          </p>
          <button 
            onClick={() => router.push("/admin/team")}
            className="px-4 py-2 bg-[#0ed632] text-white rounded-md hover:bg-[#0bc02c] transition-colors"
          >
            Manage Team
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
          <p className="text-gray-600 mb-4">
            View and manage user accounts, roles, and permissions.
          </p>
          <button 
            onClick={() => router.push("/admin/users")}
            className="px-4 py-2 bg-[#0ed632] text-white rounded-md hover:bg-[#0bc02c] transition-colors"
          >
            Manage Users
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Applications Management</h2>
          <p className="text-gray-600 mb-4">
            Review, accept, or reject user applications. Manage all application forms.
          </p>
          <button 
            onClick={() => router.push("/admin/applications")}
            className="px-4 py-2 bg-[#0ed632] text-white rounded-md hover:bg-[#0bc02c] transition-colors"
          >
            Manage Applications
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Management</h2>
          <p className="text-gray-600 mb-4">
            Manage website content, media uploads, and gallery items.
          </p>
          <button 
            onClick={() => router.push("/admin/content")}
            className="px-4 py-2 bg-[#0ed632] text-white rounded-md hover:bg-[#0bc02c] transition-colors"
          >
            Manage Content
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Showcase Management</h2>
          <p className="text-gray-600 mb-4">
            Manage team showcase, upload new showcase images, and update information.
          </p>
          <button 
            onClick={() => router.push("/admin/showcase")}
            className="px-4 py-2 bg-[#0ed632] text-white rounded-md hover:bg-[#0bc02c] transition-colors"
          >
            Manage Showcase
          </button>
        </div>
      </div>
    </div>
  );
}
