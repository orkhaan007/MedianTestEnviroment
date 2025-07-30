import { redirect } from "next/navigation";
import FormEditor from "@/components/forms/FormEditor";
import { getCurrentUser } from "@/utils/forms/db";
import Link from "next/link";
import { Button } from "@/components/common/button";

export default async function NewFormPage() {
  const user = await getCurrentUser();
  
  // Redirect to sign-in if not authenticated
  if (!user) {
    redirect("/sign-in");
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/forms">← Back to Forms</Link>
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Create New Form</h1>
      
      <FormEditor />
    </div>
  );
}
