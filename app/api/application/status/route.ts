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
    
    // Get the user's latest application
    const { data: application, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== "PGRST116") { // PGRST116 is "no rows returned" error
      console.error("Error fetching application status:", error);
      return NextResponse.json(
        { error: "Failed to fetch application status" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      application: application || null,
      hasPendingApplication: application && application.status === "pending"
    });
  } catch (error) {
    console.error("Error in application status API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
