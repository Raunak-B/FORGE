"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createSplit(payload: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { name, days } = JSON.parse(payload);

  // 1. Deactivate old splits
  await supabase.from("splits").update({ is_active: false }).eq("user_id", user.id);

  // 2. Insert new Split
  const { data: split, error: splitError } = await supabase
    .from("splits")
    .insert({ user_id: user.id, name, is_active: true })
    .select()
    .single();

  if (splitError) throw new Error("Failed to create split");

  // 3. Insert Days and Exercises
  for (const day of days) {
    if (day.exercises.length === 0) continue;

    const { data: splitDay, error: dayError } = await supabase
      .from("split_days")
      .insert({ split_id: split.id, day_index: day.index, day_name: day.name })
      .select()
      .single();

    if (dayError) throw new Error("Failed to create day");

    const exercisesToInsert = day.exercises.map((ex: any, idx: number) => ({
      split_day_id: splitDay.id,
      exercise_id: ex.exercise_id,
      order_index: idx,
      target_sets: ex.target_sets,
      target_reps_min: ex.target_reps_min,
      target_reps_max: ex.target_reps_max,
    }));

    await supabase.from("split_day_exercises").insert(exercisesToInsert);
  }

  revalidatePath("/workouts");
  return { success: true };
}

export async function logWorkout(payload: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { exercise_id, sets } = JSON.parse(payload);

  // 1. Create the base log entry
  const { data: log, error: logError } = await supabase
    .from("workout_logs")
    .insert({ user_id: user.id, exercise_id })
    .select()
    .single();

  if (logError) throw new Error("Failed to create workout log");

  // 2. Insert all performed sets
  const setsToInsert = sets.map((set: any, idx: number) => ({
    workout_log_id: log.id,
    set_index: idx,
    reps: parseInt(set.reps, 10),
    weight_kg: parseFloat(set.weight) || 0,
  }));

  const { error: setsError } = await supabase.from("log_sets").insert(setsToInsert);
  
  if (setsError) throw new Error("Failed to log sets");

  revalidatePath("/workouts");
  return { success: true };
}