import { redirect } from "next/navigation";
import { getCurrentUser } from "@/utils/gallery/db";
import { checkIsAdmin } from "@/utils/admin/checkAdmin";

export const dynamic = "force-dynamic";

export default async function UploadPage() {
  // Check if user is admin
  const isAdmin = await checkIsAdmin();
  
  if (isAdmin) {
    // Redirect admins to the admin content upload page
    redirect("/admin/content/upload");
  } else {
    // Redirect non-admin users to the gallery
    redirect("/media/gallery");
  }
}
