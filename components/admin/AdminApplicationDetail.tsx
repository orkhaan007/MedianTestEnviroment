"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

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

interface AdminApplicationDetailProps {
  application: Application;
}

export default function AdminApplicationDetail({ application }: AdminApplicationDetailProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState(application.admin_notes || "");
  const router = useRouter();
  const supabase = createClient();

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
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
          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "accepted":
        return (
          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return <span>Unknown</span>;
    }
  };

  const handleAccept = async () => {
    if (isUpdating) return;
    
    if (confirm("Are you sure you want to accept this application?")) {
      try {
        setIsUpdating(true);
        
        // Call API endpoint to update application status
        const response = await fetch(`/api/admin/applications/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            applicationId: application.id,
            status: "accepted",
            adminNotes
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update application');
        }
        
        alert("Application successfully accepted.");
        router.refresh();
      } catch (error) {
        console.error("Error updating application:", error);
        alert("Failed to update application. Please try again.");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleReject = async () => {
    if (isUpdating) return;
    
    // Check if admin notes are provided when rejecting an application
    if (!adminNotes.trim()) {
      alert("Please add a note explaining why you're rejecting this application. This note will be shown to the applicant.");
      return;
    }
    
    if (confirm("Are you sure you want to reject this application?")) {
      try {
        setIsUpdating(true);
        
        // Call API endpoint to update application status
        const response = await fetch(`/api/admin/applications/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            applicationId: application.id,
            status: "rejected",
            adminNotes
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update application');
        }
        
        alert("Application successfully rejected. Your note will be shown to the applicant.");
        router.refresh();
      } catch (error) {
        console.error("Error updating application:", error);
        alert("Failed to update application. Please try again.");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleSaveNotes = async () => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      
      // Call API endpoint to update application notes
      const response = await fetch(`/api/admin/applications/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: application.id,
          adminNotes
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update notes');
      }
      
      alert("Notes successfully saved.");
    } catch (error) {
      console.error("Error updating notes:", error);
      alert("Failed to update notes. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => router.push("/admin/applications")}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Go Back</span>
          </button>
          {getStatusBadge(application.status)}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900">{application.full_name}</h1>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
          <div>
            <span className="font-medium">Application Date:</span> {formatDate(application.created_at)}
          </div>
          <div>
            <span className="font-medium">Last Update:</span> {formatDate(application.updated_at)}
          </div>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{application.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">{application.age}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Discord Information</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Discord Nick</p>
                  <p className="font-medium">{application.discord_nick}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Discord ID</p>
                  <p className="font-medium">{application.discord_id}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Game Information</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Steam Profile</p>
                  <a 
                    href={application.steam_profile} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    View Profile
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500">FiveM Hours</p>
                  <p className="font-medium">{application.fivem_hours} hours</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Rules and Conditions</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded border ${application.accept_warning_system ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500'} flex items-center justify-center mr-2`}>
                    {application.accept_warning_system && <CheckCircle className="w-4 h-4 text-white" />}
                    {!application.accept_warning_system && <XCircle className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-sm">Accepts warning system</span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded border ${application.accept_ck_possibility ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500'} flex items-center justify-center mr-2`}>
                    {application.accept_ck_possibility && <CheckCircle className="w-4 h-4 text-white" />}
                    {!application.accept_ck_possibility && <XCircle className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-sm">Accepts possibility of CK</span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded border ${application.accept_hierarchy ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500'} flex items-center justify-center mr-2`}>
                    {application.accept_hierarchy && <CheckCircle className="w-4 h-4 text-white" />}
                    {!application.accept_hierarchy && <XCircle className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-sm">Accepts hierarchy and rules</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Why Median?</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm whitespace-pre-wrap break-words" style={{ overflowWrap: 'break-word', wordWrap: 'break-word' }}>{application.why_median}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">What does Southside mean to you?</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm whitespace-pre-wrap break-words" style={{ overflowWrap: 'break-word', wordWrap: 'break-word' }}>{application.southside_meaning}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Admin Notes</h2>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632] overflow-wrap-break-word whitespace-pre-wrap"
              placeholder="Add notes about this application..."
              style={{ overflowWrap: 'break-word', wordWrap: 'break-word' }}
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={handleSaveNotes}
                disabled={isUpdating}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
              >
                {isUpdating ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {application.status === "pending" && (
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={handleReject}
            disabled={isUpdating}
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Processing..." : "Reject"}
          </button>
          
          <button
            onClick={handleAccept}
            disabled={isUpdating}
            className="px-6 py-3 bg-[#0ed632] text-white font-medium rounded-md hover:bg-[#0bc02c] focus:outline-none focus:ring-2 focus:ring-[#0ed632] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Processing..." : "Accept"}
          </button>
        </div>
      )}
    </div>
  );
}