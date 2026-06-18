import { createClient } from "@/lib/supabase/server";
import Container from "@/components/ui/Container";
import LibraryClient from "./LibraryClient";

export const metadata = {
  title: "Exercise Library | Forge",
};

export default async function LibraryPage() {
  const supabase = await createClient();

  const { data: exercises, error } = await supabase
    .from("exercises")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching exercises:", error);
    return (
      <Container className="py-12">
        <p className="text-plate">Failed to load exercise library.</p>
      </Container>
    );
  }

  return (
    <Container className="py-12 flex flex-col gap-8">
      <div>
        <h1 className="font-display text-5xl font-bold text-chalk uppercase tracking-wide">
          Exercise Library
        </h1>
        <p className="font-sans text-steel text-lg mt-2">
          Browse movements by muscle group or search by name.
        </p>
      </div>

      <LibraryClient initialExercises={exercises || []} />
    </Container>
  );
}