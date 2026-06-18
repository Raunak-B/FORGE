import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";

export default async function ExerciseDetailPage(
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const supabase = await createClient();

  const { data: exercise, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !exercise) {
    notFound();
  }

  return (
    <Container className="py-12 flex flex-col gap-10">
      {/* Back Navigation */}
      <div>
        <Link
          href="/workouts/library"
          className="text-sm font-sans text-steel hover:text-chalk transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded px-1 -ml-1"
        >
          ← Back to Library
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Image Area */}
        <div className="w-full aspect-square relative rounded-xl border border-steel/30 bg-white/5 overflow-hidden flex items-center justify-center">
          {exercise.image_url ? (
            <Image
              src={exercise.image_url}
              alt={exercise.name}
              fill
              className="object-cover mix-blend-luminosity"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <span className="font-display text-steel text-3xl">NO IMAGE</span>
          )}
        </div>

        {/* Right Column: Details & Instructions */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="font-display text-5xl font-bold text-chalk uppercase tracking-wide leading-none capitalize">
              {exercise.name}
            </h1>
            
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-plate/20 border border-plate text-plate rounded text-xs font-mono uppercase tracking-widest">
                {exercise.muscle_group.replace("_", " ")}
              </span>
              <span className="px-3 py-1 bg-steel/20 border border-steel text-steel rounded text-xs font-mono uppercase tracking-widest">
                {exercise.equipment}
              </span>
              <span className="px-3 py-1 bg-brass/20 border border-brass text-brass rounded text-xs font-mono uppercase tracking-widest">
                {exercise.category}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-display text-3xl font-bold text-chalk border-b border-steel/30 pb-2">
              FORM GUIDE
            </h2>
            
            {exercise.instructions && exercise.instructions.length > 0 ? (
              <ol className="flex flex-col gap-4 pl-4 font-sans text-chalk/80 list-decimal list-outside marker:font-mono marker:text-brass marker:font-bold">
                {exercise.instructions.map((step: string, idx: number) => (
                  <li key={idx} className="pl-2 leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-steel font-sans italic">
                No form instructions available for this exercise.
              </p>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}