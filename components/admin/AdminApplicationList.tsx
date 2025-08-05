"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ArrowDown, ArrowUp, CheckCircle, XCircle, Eye } from "lucide-react";
import Link from "next/link";

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

interface AdminApplicationListProps {
  applications: Application[];
  onStatusChange: (applicationId: string, newStatus: string) => void;
}

export default function AdminApplicationList({ applications, onStatusChange }: AdminApplicationListProps) {
  const [sortField, setSortField] = useState<keyof Application>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const supabase = createClient();

  // Handle sorting
  const handleSort = (field: keyof Application) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort applications
  const sortedApplications = [...applications].sort((a, b) => {
    let valueA = a[sortField];
    let valueB = b[sortField];

    // Handle null values
    if (valueA === null) valueA = "";
    if (valueB === null) valueB = "";

    // Convert dates to timestamps for comparison
    if (sortField === "created_at" || sortField === "updated_at") {
      const dateA = valueA ? new Date(valueA as string).getTime() : 0;
      const dateB = valueB ? new Date(valueB as string).getTime() : 0;
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }

    // String comparison
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    // Number comparison
    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortDirection === "asc"
        ? valueA - valueB
        : valueB - valueA;
    }

    return 0;
  });

  const handleAccept = async (applicationId: string) => {
    if (isUpdating) return;
    
    if (confirm("Are you sure you want to accept this application?")) {
      try {
        setIsUpdating(applicationId);
        
        // Call API endpoint to update application status
        const response = await fetch(`/api/admin/applications/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            applicationId,
            status: "accepted"
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update application');
        }
        
        // Call the callback to update the parent component's state
        onStatusChange(applicationId, "accepted");
      } catch (error) {
        console.error("Error updating application:", error);
        alert("Failed to update application. Please try again.");
      } finally {
        setIsUpdating(null);
      }
    }
  };

  const handleReject = async (applicationId: string) => {
    if (isUpdating) return;
    
    if (confirm("Are you sure you want to reject this application?")) {
      try {
        setIsUpdating(applicationId);
        
        // Call API endpoint to update application status
        const response = await fetch(`/api/admin/applications/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            applicationId,
            status: "rejected"
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update application');
        }
        
        // Call the callback to update the parent component's state
        onStatusChange(applicationId, "rejected");
      } catch (error) {
        console.error("Error updating application:", error);
        alert("Failed to update application. Please try again.");
      } finally {
        setIsUpdating(null);
      }
    }
  };

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
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "accepted":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return <span>Unknown</span>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("full_name")}
            >
              <div className="flex items-center">
                Name / Age
                {sortField === "full_name" && (
                  sortDirection === "asc" ? 
                    <ArrowUp className="ml-1 h-4 w-4" /> : 
                    <ArrowDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </th>
            <th 
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("discord_nick")}
            >
              <div className="flex items-center">
                Discord
                {sortField === "discord_nick" && (
                  sortDirection === "asc" ? 
                    <ArrowUp className="ml-1 h-4 w-4" /> : 
                    <ArrowDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </th>
            <th 
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("fivem_hours")}
            >
              <div className="flex items-center">
                FiveM Hours
                {sortField === "fivem_hours" && (
                  sortDirection === "asc" ? 
                    <ArrowUp className="ml-1 h-4 w-4" /> : 
                    <ArrowDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </th>
            <th 
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("created_at")}
            >
              <div className="flex items-center">
                Application Date
                {sortField === "created_at" && (
                  sortDirection === "asc" ? 
                    <ArrowUp className="ml-1 h-4 w-4" /> : 
                    <ArrowDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </th>
            <th 
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center">
                Status
                {sortField === "status" && (
                  sortDirection === "asc" ? 
                    <ArrowUp className="ml-1 h-4 w-4" /> : 
                    <ArrowDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedApplications.map((application) => (
            <tr 
              key={application.id} 
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{application.full_name}</div>
                <div className="text-sm text-gray-500">{application.age} years</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{application.discord_nick}</div>
                <div className="text-sm text-gray-500">{application.discord_id}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{application.fivem_hours} hours</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{formatDate(application.created_at)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(application.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Link
                    href={`/admin/applications/${application.id}`}
                    className="text-blue-600 hover:text-blue-900"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                  
                  {application.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleAccept(application.id)}
                        disabled={isUpdating === application.id}
                        className="text-green-600 hover:text-green-900"
                        title="Accept Application"
                      >
                        {isUpdating === application.id ? (
                          <div className="w-5 h-5 border-t-2 border-green-500 rounded-full animate-spin"></div>
                        ) : (
                          <CheckCircle className="h-5 w-5" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleReject(application.id)}
                        disabled={isUpdating === application.id}
                        className="text-red-600 hover:text-red-900"
                        title="Reject Application"
                      >
                        {isUpdating === application.id ? (
                          <div className="w-5 h-5 border-t-2 border-red-500 rounded-full animate-spin"></div>
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {sortedApplications.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                No applications found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
