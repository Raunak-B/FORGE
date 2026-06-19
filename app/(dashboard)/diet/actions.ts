"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type NutritionTargets = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

// 1. Calculate Targets (Mifflin-St Jeor)
export async function calculateTargets(profile: any): Promise<NutritionTargets> {
  const { weight_kg, height_cm, age, sex, activity_level, goal } = profile;

  // Base Metabolic Rate
  let bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age;
  bmr += sex === "male" ? 5 : -161;

  // Activity Multipliers
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  const tdee = bmr * (multipliers[activity_level] || 1.2);

  // Goal Adjustment
  let targetCals = tdee;
  if (goal === "fat_loss") targetCals -= 400;
  if (goal === "strength" || goal === "hypertrophy") targetCals += 300;

  // Macros
  const protein = 1.8 * weight_kg; // 1.8g per kg
  const fatCals = targetCals * 0.25; // 25% of calories from fat
  const fat = fatCals / 9;
  const carbsCals = targetCals - (protein * 4) - fatCals;
  const carbs = carbsCals / 4;

  return {
    calories: Math.round(targetCals),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
  };
}

// 2. Secure USDA API Call
export async function searchFood(query: string) {
  if (!query) return [];
  
  const apiKey = process.env.FDC_API_KEY; // Keep this in your .env.local
  if (!apiKey) throw new Error("FDC API key missing");

  const res = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=10&api_key=${apiKey}`
  );

  if (!res.ok) throw new Error("Failed to fetch food data");
  
  const data = await res.json();
  
  // Map USDA data structure to our app's format
  return data.foods.map((food: any) => {
    const getNutrient = (id: number) => {
      const n = food.foodNutrients.find((fn: any) => fn.nutrientId === id);
      return n ? n.value : 0;
    };

    return {
      id: food.fdcId,
      name: food.description,
      brand: food.brandOwner || "",
      servingSize: food.servingSize || 100,
      servingUnit: food.servingSizeUnit || "g",
      // USDA Nutrient IDs: 1008 = Calories, 1003 = Protein, 1005 = Carbs, 1004 = Fat
      calories: getNutrient(1008),
      protein: getNutrient(1003),
      carbs: getNutrient(1005),
      fat: getNutrient(1004),
    };
  });
}

// 3. Log Food to Database
export async function logFood(payload: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const entry = JSON.parse(payload);

  const { error } = await supabase.from("diet_logs").insert({
    user_id: user.id,
    food_name: entry.name,
    quantity: entry.quantity,
    calories: entry.calories,
    protein_g: entry.protein,
    carbs_g: entry.carbs,
    fat_g: entry.fat,
  });

  if (error) throw new Error("Failed to log food");

  revalidatePath("/diet");
  return { success: true };
}