import { createClient } from "@/lib/supabase/server";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Link from "next/link";
import Button from "@/components/ui/Button";
import LoggerModal from "./LoggerModal";

export default async function WorkoutsDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get active split and today's exercises
  const todayIndex = new Date().getDay(); // 0 (Sun) to 6 (Sat)
  
  const { data: activeSplit } = await supabase
    .from("splits")
    .select(`
      id, name,
      split_days (
        id, day_name, day_index,
        split_day_exercises (
          id, order_index, target_sets, target_reps_min, target_reps_max,
          exercises ( id, name, muscle_group, image_url )
        )
      )
    `)
    .eq("user_id", user?.id)
    .eq("is_active", true)
    .single();

  const todayRoutine = activeSplit?.split_days.find((d: any) => d.day_index === todayIndex);
  
  // Sort exercises by order_index
  const sortedExercises = todayRoutine?.split_day_exercises.sort((a: any, b: any) => a.order_index - b.order_index) || [];

  // Fetch recent logs for "Last time" UI
  const exerciseIds = sortedExercises.map((e: any) => e.exercises.id);
  const { data: recentLogs } = await supabase
    .from("workout_logs")
    .select("exercise_id, performed_at, log_sets(reps, weight_kg)")
    .in("exercise_id", exerciseIds)
    .order("performed_at", { ascending: false });

  // Helper to extract the most recent set data for a specific exercise
  const getLastLog = (exId: string) => {
    const log = recentLogs?.find(l => l.exercise_id === exId);
    if (!log || log.log_sets.length === 0) return null;
    const sets = log.log_sets.length;
    const bestSet = log.log_sets.sort((a: any, b: any) => b.weight_kg - a.weight_kg)[0];
    return `${sets}×${bestSet.reps} @ ${bestSet.weight_kg}kg`;
  };

  if (!activeSplit) {
    return (
      <Container className="py-20 text-center flex flex-col items-center gap-6">
        <h1 className="font-display text-4xl text-steel">NO ACTIVE SPLIT</h1>
        <Link href="/workouts/splits">
          <Button>Create Routine</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <span className="text-brass font-mono text-sm tracking-widest uppercase">{activeSplit.name}</span>
          <h1 className="font-display text-5xl font-bold text-chalk uppercase tracking-wide mt-1">
            {todayRoutine?.day_name || "Rest Day"}
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {sortedExercises.length === 0 ? (
          <Card><p className="text-steel font-sans italic">Enjoy your rest day.</p></Card>
        ) : (
          sortedExercises.map((item: any) => {
            const ex = item.exercises;
            const lastLogStr = getLastLog(ex.id);

            return (
              <LoggerModal key={item.id} exercise={ex}>
                <Card className="cursor-pointer group hover:border-plate/50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <span className="font-display text-2xl font-bold text-chalk group-hover:text-plate transition-colors uppercase">
                        {ex.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-steel">
                          {item.target_sets} sets x {item.target_reps_min}-{item.target_reps_max} reps
                        </span>
                        {lastLogStr && (
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-brass/10 text-brass">
                            Last: {lastLogStr}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </LoggerModal>
            );
          })
        )}
      </div>
    </Container>
  );
}