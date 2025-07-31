import { notFound, redirect } from "next/navigation";
import FormEditor from "@/components/forms/FormEditor";
import { getFormById, getCurrentUser } from "@/utils/forms/db";
import Link from "next/link";
import { Button } from "@/components/common/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface EditFormPageProps {
  params: {
    id: string;
  };
}

export default async function EditFormPage({ params }: EditFormPageProps) {
  const formId = String(params?.id || '');
  const form = await getFormById(formId);
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/sign-in");
  }
  
  if (!form) {
    notFound();
  }
  
  if (form.user_id !== user.id) {
    redirect(`/forms/${formId}`);
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href={`/forms/${formId}`}>← Back to Form</Link>
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold mb-6">Edit Form</h1>
          
          <FormEditor form={form} isEdit={true} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
