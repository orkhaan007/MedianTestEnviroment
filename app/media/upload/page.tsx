import { redirect } from "next/navigation";
import { getCurrentUser } from "@/utils/gallery/db";
import { checkIsAdmin } from "@/utils/admin/checkAdmin";

export const dynamic = "force-dynamic";

export default async function UploadPage() {
  // This page now redirects to the admin content upload page
  // Regular users will be redirected to the gallery
  
  // Redirect to admin content upload page
  redirect("/admin/content/upload");
}
