import Link from "next/link";
import { Button } from "@/components/common/button";

export default function FormNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <h1 className="text-4xl font-bold mb-4">Form Not Found</h1>
      <p className="text-gray-600 mb-8">
        The form you are looking for does not exist or has been deleted.
      </p>
      <Button asChild>
        <Link href="/forms">Back to Forms</Link>
      </Button>
    </div>
  );
}
