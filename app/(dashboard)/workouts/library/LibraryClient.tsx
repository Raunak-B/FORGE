"use client";

import { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

type Exercise = {
  id: string;
  name: string;
  muscle_group: string;
  equipment: string;
  image_url: string | null;
};

export default function LibraryClient({ initialExercises }: { initialExercises: Exercise[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const shouldReduceMotion = useReducedMotion();

  // Filter and group exercises based on search
  const groupedExercises = useMemo(() => {
    const filtered = initialExercises.filter((ex) =>
      ex.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.reduce((acc, ex) => {
      if (!acc[ex.muscle_group]) acc[ex.muscle_group] = [];
      acc[ex.muscle_group].push(ex);
      return acc;
    }, {} as Record<string, Exercise[]>);
  }, [initialExercises, searchQuery]);

  const muscleOrder = ["chest", "back", "legs", "shoulders", "arms", "core", "full_body"];

  return (
    <div className="flex flex-col gap-10">
      {/* Search Input */}
      <div className="relative max-w-xl">
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-steel/50 bg-iron/50 px-4 py-3 text-chalk placeholder:text-steel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass shadow-sm"
        />
      </div>

      {/* Grid Render */}
      <div className="flex flex-col gap-12">
        {muscleOrder.map((muscle) => {
          const exercisesInGroup = groupedExercises[muscle];
          if (!exercisesInGroup || exercisesInGroup.length === 0) return null;

          return (
            <motion.section
              key={muscle}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6"
            >
              <h2 className="font-display text-3xl font-bold text-brass uppercase tracking-widest border-b border-steel/30 pb-2">
                {muscle.replace("_", " ")}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {exercisesInGroup.map((ex) => (
                  <Link
                    key={ex.id}
                    href={`/workouts/library/${ex.id}`}
                    className="group flex flex-col rounded-xl border border-steel/30 bg-iron/50 overflow-hidden transition-all hover:border-steel hover:bg-steel/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                  >
                    <div className="aspect-square w-full relative bg-white/5 flex items-center justify-center">
                      {ex.image_url ? (
                        <Image
                          src={ex.image_url}
                          alt={ex.name}
                          fill
                          className="object-cover mix-blend-luminosity opacity-80 transition-opacity group-hover:opacity-100"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      ) : (
                        <span className="font-display text-steel text-xl">NO IMAGE</span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-sans font-bold text-chalk capitalize line-clamp-1">
                        {ex.name}
                      </h3>
                      <span className="font-mono text-xs text-steel uppercase mt-1">
                        {ex.equipment}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          );
        })}

        {Object.keys(groupedExercises).length === 0 && (
          <p className="text-steel font-sans italic">No exercises found matching your search.</p>
        )}
      </div>
    </div>
  );
}