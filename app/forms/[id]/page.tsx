import { notFound } from "next/navigation";
import { getFormById, getCurrentUser } from "@/utils/forms/db";
import Form from "@/components/forms/Form";
import Link from "next/link";
import { Button } from "@/components/common/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface FormPageProps {
  params: {
    id: string;
  };
}

export default async function FormPage({ params }: FormPageProps) {
  const formId = String(params?.id || '');
  const form = await getFormById(formId);
  const user = await getCurrentUser();
  
  if (!form) {
    notFound();
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/forms">← Back to Forms</Link>
            </Button>
          </div>
          
          <Form form={form} currentUserId={user?.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
