import { notFound, redirect } from "next/navigation";
import FormEditor from "@/components/forms/FormEditor";
import { getFormById, getCurrentUser } from "@/utils/forms/db";
import Link from "next/link";
import { Button } from "@/components/common/button";

interface EditFormPageProps {
  params: {
    id: string;
  };
}

export default async function EditFormPage({ params }: EditFormPageProps) {
  const form = await getFormById(params.id);
  const user = await getCurrentUser();
  
  // Redirect to sign-in if not authenticated
  if (!user) {
    redirect("/sign-in");
  }
  
  // Return 404 if form doesn't exist
  if (!form) {
    notFound();
  }
  
  // Redirect if user is not the owner of the form
  if (form.user_id !== user.id) {
    redirect(`/forms/${params.id}`);
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href={`/forms/${params.id}`}>← Back to Form</Link>
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Edit Form</h1>
      
      <FormEditor form={form} isEdit={true} />
    </div>
  );
}
