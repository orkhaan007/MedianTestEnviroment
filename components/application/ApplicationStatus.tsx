"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface Application {
  id: string;
  full_name: string;
  discord_nick: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
  admin_notes?: string;
}

export default function ApplicationStatus() {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchApplicationStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError("Please sign in to view your application");
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from("applications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        
        if (error) {
          if (error.code === "PGRST116") {
            setError("You haven't submitted an application yet");
          } else {
            console.error("Error fetching application:", error);
            setError("An error occurred while retrieving your application");
          }
        } else {
          setApplication(data as Application);
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    }
    
    fetchApplicationStatus();
  }, [supabase]);

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <div className="flex items-center text-yellow-600">
            <Clock className="w-5 h-5 mr-2" />
            <span>Pending</span>
          </div>
        );
      case "accepted":
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>Accepted</span>
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center text-red-600">
            <XCircle className="w-5 h-5 mr-2" />
            <span>Rejected</span>
          </div>
        );
      default:
        return <span>Unknown</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ed632]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <XCircle className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{error}</h2>
          <p className="text-gray-600 mb-6">
            You can click the button below to submit an application.
          </p>
          <a
            href="/application"
            className="px-6 py-3 bg-[#0ed632] text-white font-medium rounded-md hover:bg-[#0bc02c] focus:outline-none focus:ring-2 focus:ring-[#0ed632] focus:ring-offset-2 transition-colors"
          >
            Apply Now
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Application Status</h1>
      
      {application && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{application.full_name}</h2>
              <p className="text-gray-600">{application.discord_nick}</p>
            </div>
            <div>
              {getStatusBadge(application.status)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Application Date</p>
              <p className="font-medium">{formatDate(application.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Update</p>
              <p className="font-medium">{formatDate(application.updated_at)}</p>
            </div>
          </div>
          
          {application.status === "pending" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-yellow-800">
                Your application is being reviewed. Please wait for the result. You will be notified about the outcome.
              </p>
            </div>
          )}
          
          {application.status === "accepted" && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800 font-medium mb-2">
                Congratulations! Your application has been accepted.
              </p>
              <p className="text-green-700">
                You can join our Discord server to become part of our team. Please contact us via Discord for detailed information.
              </p>
              {application.admin_notes && (
                <div className="mt-3 border-t border-green-200 pt-3">
                  <p className="text-gray-700 font-medium">Admin Note:</p>
                  <p className="text-green-700 mt-1">{application.admin_notes}</p>
                </div>
              )}
            </div>
          )}
          
          {application.status === "rejected" && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 font-medium mb-2">
                We're sorry, your application has been rejected.
              </p>
              {application.admin_notes ? (
                <div className="mt-3 border-t border-red-200 pt-3">
                  <p className="text-gray-700 font-medium">Admin Note:</p>
                  <p className="text-red-700 mt-1">{application.admin_notes}</p>
                </div>
              ) : (
                <p className="text-red-700">
                  For more information, you can contact us via Discord.
                </p>
              )}
            </div>
          )}
          
          <div className="flex justify-end pt-4">
            {application.status === "rejected" && (
              <a
                href="/application"
                className="px-6 py-3 bg-[#0ed632] text-white font-medium rounded-md hover:bg-[#0bc02c] focus:outline-none focus:ring-2 focus:ring-[#0ed632] focus:ring-offset-2 transition-colors"
              >
                Apply Again
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
