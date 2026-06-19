"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function FeedClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Listen to changes across all community tables, trigger an RSC background refresh
    const channel = supabase
      .channel("community_updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => router.refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "post_likes" }, () => router.refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "post_comments" }, () => router.refresh())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return <div className="flex flex-col gap-6">{children}</div>;
}