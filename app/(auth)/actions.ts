"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { recommendSplit } from "@/lib/recommendation-engine";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return redirect("/login?error=Could not authenticate user");
  return redirect("/workouts");
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    let errorMessage = error.message;
    
    // Clean up specific Supabase error strings for better UX
    if (errorMessage === "User already registered") {
      errorMessage = "An account with that email already exists.";
    }

    return redirect(`/signup?error=${encodeURIComponent(errorMessage)}`);
  }

  return redirect("/onboarding");
}

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // Extract variables needed for the engine
  const goal = formData.get("goal") as "strength" | "hypertrophy" | "endurance" | "fat_loss";
  const experience_level = formData.get("experience_level") as "beginner" | "intermediate" | "advanced";
  const days_per_week = parseInt(formData.get("days_per_week") as string, 10);
  const minutes_per_session = parseInt(formData.get("minutes_per_session") as string, 10);

  // 1. Upsert Profile
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    goal,
    experience_level,
    days_per_week,
    minutes_per_session,
    sex: formData.get("sex"),
    age: parseInt(formData.get("age") as string, 10),
    height_cm: parseFloat(formData.get("height_cm") as string),
    weight_kg: parseFloat(formData.get("weight_kg") as string),
    activity_level: formData.get("activity_level"),
  });

  if (profileError) throw new Error("Failed to save profile details");

  // 2. Fetch exercise library for the engine
  const { data: availableExercises } = await supabase
    .from("exercises")
    .select("id, muscle_group, equipment");

  if (availableExercises && availableExercises.length > 0) {
    // 3. Run Recommendation Engine
    const recommendedSplit = recommendSplit(
      { goal, experience_level, days_per_week, minutes_per_session },
      availableExercises
    );

    // 4. Insert the generated split
    const { data: split, error: splitError } = await supabase
      .from("splits")
      .insert({ user_id: user.id, name: recommendedSplit.name, is_active: true })
      .select()
      .single();

    if (!splitError && split) {
      // 5. Insert days and exercises
      for (const day of recommendedSplit.days) {
        const { data: splitDay } = await supabase
          .from("split_days")
          .insert({ split_id: split.id, day_index: day.day_index, day_name: day.day_name })
          .select()
          .single();

        if (splitDay && day.exercises.length > 0) {
          const exercisesToInsert = day.exercises.map(ex => ({
            split_day_id: splitDay.id,
            ...ex
          }));
          await supabase.from("split_day_exercises").insert(exercisesToInsert);
        }
      }
    }
  }

  // Redirect to their newly generated active dashboard
  return redirect("/workouts");
}