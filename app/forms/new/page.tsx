import { redirect } from "next/navigation";
import FormEditor from "@/components/forms/FormEditor";
import { getCurrentUser } from "@/utils/forms/db";
import Link from "next/link";
import { Button } from "@/components/common/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default async function NewFormPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/sign-in");
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/forms">← Back to Forms</Link>
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold mb-6">Create New Form</h1>
          
          <FormEditor />
        </div>
      </main>
      <Footer />
    </div>
  );
}
