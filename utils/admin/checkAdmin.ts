"use client";

/**
 * Client-side utility to check if the current user is an admin
 * @returns Promise<boolean> - True if the user is an admin, false otherwise
 */
export async function checkIsAdmin(): Promise<boolean> {
  try {
    const response = await fetch("/api/admin/check");
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.isAdmin === true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
