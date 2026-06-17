import { login } from "../actions";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <h1 className="font-display text-4xl font-bold text-chalk mb-6 text-center">
          WELCOME BACK
        </h1>
        
        {/* We would extract the searchParams.error here to show a banner in a real client/server component setup */}

        <form action={login} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-chalk/80">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="rounded-md border border-steel/50 bg-iron/50 px-3 py-2 text-chalk placeholder:text-steel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
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
              className="rounded-md border border-steel/50 bg-iron/50 px-3 py-2 text-chalk placeholder:text-steel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            />
          </div>

          <Button type="submit" className="mt-4 w-full">
            Log In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-chalk/60">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-brass hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded px-1"
          >
            Sign Up
          </Link>
        </p>
      </Card>
    </div>
  );
}