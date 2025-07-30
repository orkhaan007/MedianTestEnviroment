import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import Link from "next/link";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="w-full h-screen flex items-center justify-center">
        <form className="w-[400px] flex flex-col gap-2 p-5 border border-zinc-300 rounded-md">
        <div>
          <h1 className="text-2xl font-medium">Forgot Password?</h1>
          <p className="text-sm text-secondary-foreground">
            Already have an account?{" "}
            <Link className="text-primary underline" href="/sign-in">
              Sign in
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <SubmitButton formAction={forgotPasswordAction}>
            Proceed
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
