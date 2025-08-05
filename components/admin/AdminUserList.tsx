"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_admin: boolean;
}

interface AdminUserListProps {
  users: User[];
  onUserDeleted: (userId: string) => void;
}

export default function AdminUserList({ users, onUserDeleted }: AdminUserListProps) {
  const [sortField, setSortField] = useState<keyof User>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const supabase = createClient();

  // Handle sorting
  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort users
  const sortedUsers = [...users].sort((a, b) => {
    let valueA = a[sortField];
    let valueB = b[sortField];

    // Handle null values
    if (valueA === null) valueA = "";
    if (valueB === null) valueB = "";

    // Convert dates to timestamps for comparison
    if (sortField === "created_at" || sortField === "last_sign_in_at") {
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

    // Boolean comparison
    if (typeof valueA === "boolean" && typeof valueB === "boolean") {
      return sortDirection === "asc"
        ? Number(valueA) - Number(valueB)
        : Number(valueB) - Number(valueA);
    }

    return 0;
  });

  const handleDelete = async (userId: string, userEmail: string) => {
    if (isDeleting) return;
    
    // Don't allow deleting admin users
    const { data: adminData } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", userEmail)
      .single();
      
    if (adminData) {
      alert("Cannot delete admin users. Remove admin privileges first.");
      return;
    }
    
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        setIsDeleting(userId);
        
        // Call API endpoint to delete user
        const response = await fetch(`/api/admin/users/delete?userId=${userId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete user');
        }
        
        // Call the callback to update the parent component's state
        onUserDeleted(userId);
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      } finally {
        setIsDeleting(null);
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center">
                Name
                {sortField === "name" && (
                  sortDirection === "asc" ? 
                    <ArrowUp className="ml-1 h-4 w-4" /> : 
                    <ArrowDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </th>
            <th 
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("email")}
            >
              <div className="flex items-center">
                Email
                {sortField === "email" && (
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
                Joined
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
              onClick={() => handleSort("last_sign_in_at")}
            >
              <div className="flex items-center">
                Last Sign In
                {sortField === "last_sign_in_at" && (
                  sortDirection === "asc" ? 
                    <ArrowUp className="ml-1 h-4 w-4" /> : 
                    <ArrowDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedUsers.map((user) => (
            <tr 
              key={user.id} 
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{user.name || "No name"}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{formatDate(user.created_at)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{formatDate(user.last_sign_in_at)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.is_admin ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Admin
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    User
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleDelete(user.id, user.email)}
                  disabled={isDeleting === user.id || user.is_admin}
                  className={`text-red-600 hover:text-red-900 ${
                    user.is_admin ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  title={user.is_admin ? "Cannot delete admin users" : "Delete user"}
                >
                  {isDeleting === user.id ? (
                    <div className="w-5 h-5 border-t-2 border-red-500 rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                </button>
              </td>
            </tr>
          ))}
          {sortedUsers.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
