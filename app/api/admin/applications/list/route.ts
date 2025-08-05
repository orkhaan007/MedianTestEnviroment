import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Check if user is an admin
    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", user.email)
      .single();
    
    if (adminError || !adminUser) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }
    
    // Get URL parameters
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    
    // Build query
    let query = supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });
    
    // Filter by status if provided
    if (status && ["pending", "accepted", "rejected"].includes(status)) {
      query = query.eq("status", status);
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching applications:", error);
      return NextResponse.json(
        { error: "Failed to fetch applications" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ applications: data });
  } catch (error) {
    console.error("Error in applications list API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
