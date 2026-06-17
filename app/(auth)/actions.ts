"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

  if (error) return redirect("/signup?error=Could not create account");
  return redirect("/onboarding");
}

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    goal: formData.get("goal"),
    experience_level: formData.get("experience_level"),
    days_per_week: parseInt(formData.get("days_per_week") as string, 10),
    minutes_per_session: parseInt(formData.get("minutes_per_session") as string, 10),
    sex: formData.get("sex"),
    age: parseInt(formData.get("age") as string, 10),
    height_cm: parseFloat(formData.get("height_cm") as string),
    weight_kg: parseFloat(formData.get("weight_kg") as string),
    activity_level: formData.get("activity_level"),
  });

  if (error) throw new Error("Failed to save profile details");

  return redirect("/workouts");
}