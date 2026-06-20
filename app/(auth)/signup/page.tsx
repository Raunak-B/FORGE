import { signup } from "../actions";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default async function SignupPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <h1 className="font-display text-4xl font-bold text-chalk mb-6 text-center uppercase tracking-wide">
          JOIN FORGE
        </h1>
        
        {/* Inline Error Banner */}
        {searchParams?.error && (
          <div className="mb-6 rounded-md border border-plate/50 bg-plate/10 p-3 text-center text-sm font-medium text-plate shadow-sm">
            {searchParams.error}
          </div>
        )}

        <form action={signup} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-chalk/80">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="rounded-md border border-steel/50 bg-iron/50 px-3 py-2 text-chalk placeholder:text-steel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass transition-colors shadow-sm"
              placeholder="lifter@forge.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-chalk/80">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="rounded-md border border-steel/50 bg-iron/50 px-3 py-2 text-chalk placeholder:text-steel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass transition-colors shadow-sm"
            />
          </div>

          <Button type="submit" className="mt-4 w-full text-base">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-chalk/60 font-sans">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-brass hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded px-1 transition-colors"
          >
            Log In
          </Link>
        </p>
      </Card>
    </div>
  );
}