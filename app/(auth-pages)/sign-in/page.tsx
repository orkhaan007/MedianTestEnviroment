import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form className="flex flex-col w-[400px] border border-zinc-300 p-5 rounded-md">
        <h1 className="text-2xl font-medium">Sign in</h1>
        <p className="text-sm text-foreground">
          Don't have an account?{" "}
          <Link className="text-foreground font-medium underline" href="/sign-up">
            Sign up
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              className="text-xs text-foreground underline"
              href="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            required
          />
          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Sign in
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
