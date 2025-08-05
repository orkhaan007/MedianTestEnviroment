"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { checkAdminServerSide } from "@/utils/admin/serverAdminCheck";
import AdminApplicationList from "@/components/admin/AdminApplicationList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

interface Application {
  id: string;
  full_name: string;
  age: number;
  discord_nick: string;
  discord_id: string;
  steam_profile: string;
  fivem_hours: number;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
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
    async function fetchApplications() {
      try {
        const { data, error } = await supabase
          .from("applications")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setApplications(data as Application[]);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchApplications();
  }, [supabase]);

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    setApplications(prevApplications => 
      prevApplications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus as "pending" | "accepted" | "rejected" } : app
      )
    );
  };

  // Filter applications based on search query first
  const filteredApplications = applications.filter(
    (app) =>
      app.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.discord_nick?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.discord_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.steam_profile?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Then filter by status
  const pendingApplications = filteredApplications.filter(app => app.status === "pending");
  const acceptedApplications = filteredApplications.filter(app => app.status === "accepted");
  const rejectedApplications = filteredApplications.filter(app => app.status === "rejected");

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ed632]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Link href="/admin" className="mr-4">
          <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-[#0ed632]" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Applications Management</h1>
      </div>
      
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="pending" className="relative">
            Pending Applications
            {pendingApplications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingApplications.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Pending Applications</h2>
          {pendingApplications.length > 0 ? (
            <AdminApplicationList 
              applications={pendingApplications} 
              onStatusChange={handleStatusChange} 
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              No pending applications found.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="accepted" className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Accepted Applications</h2>
          {acceptedApplications.length > 0 ? (
            <AdminApplicationList 
              applications={acceptedApplications} 
              onStatusChange={handleStatusChange} 
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              No accepted applications found.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rejected" className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Rejected Applications</h2>
          {rejectedApplications.length > 0 ? (
            <AdminApplicationList 
              applications={rejectedApplications} 
              onStatusChange={handleStatusChange} 
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              No rejected applications found.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}