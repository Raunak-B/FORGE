type Goal = "strength" | "hypertrophy" | "endurance" | "fat_loss";
type Experience = "beginner" | "intermediate" | "advanced";

interface UserInput {
  goal: Goal;
  experience_level: Experience;
  days_per_week: number;
  minutes_per_session: number;
}

interface RawExercise {
  id: string;
  muscle_group: string;
  equipment: string;
}

// Internal structures for building the split
type DayStructure = { name: string; muscles: string[] };

export function recommendSplit(input: UserInput, availableExercises: RawExercise[]) {
  // 1. Goal -> Volume & Rest Rules
  const goalRules = {
    strength: { sets: 4, minReps: 3, maxReps: 6, rest: "2-4 min" },
    hypertrophy: { sets: 3, minReps: 8, maxReps: 12, rest: "60-90 sec" },
    endurance: { sets: 2, minReps: 15, maxReps: 20, rest: "30-45 sec" },
    fat_loss: { sets: 3, minReps: 12, maxReps: 15, rest: "20-30 sec" },
  };
  const config = goalRules[input.goal];

  // 2. Volume -> Exercises per day ( clamped between 4 and 8 )
  const maxExercisesPerDay = Math.max(4, Math.min(8, Math.round(input.minutes_per_session / 10)));

  // 3. Experience -> Filter Exercises
  let eligibleExercises = availableExercises;
  if (input.experience_level === "beginner") {
    const safeEquipment = ["body only", "machine", "dumbbell", "cable"];
    eligibleExercises = availableExercises.filter(ex => 
      safeEquipment.some(eq => ex.equipment.toLowerCase().includes(eq))
    );
  }

  // Fallback if filter is too strict
  if (eligibleExercises.length < 10) eligibleExercises = availableExercises; 

  // 4. Days/Week -> Split Routing
  let days: DayStructure[] = [];
  const fullBody = ["chest", "back", "legs", "shoulders", "arms", "core"];
  const upper = ["chest", "back", "shoulders", "arms"];
  const lower = ["legs", "core"];
  const push = ["chest", "shoulders", "arms"];
  const pull = ["back", "arms"];

  if (input.days_per_week <= 2) {
    days = Array(input.days_per_week).fill({ name: "Full Body", muscles: fullBody });
  } else if (input.days_per_week === 3) {
    days = input.experience_level === "beginner" 
      ? Array(3).fill({ name: "Full Body", muscles: fullBody })
      : [
          { name: "Push", muscles: push }, 
          { name: "Pull", muscles: pull }, 
          { name: "Legs", muscles: lower }
        ];
  } else if (input.days_per_week === 4) {
    days = [
      { name: "Upper A", muscles: upper }, { name: "Lower A", muscles: lower },
      { name: "Upper B", muscles: upper }, { name: "Lower B", muscles: lower }
    ];
  } else if (input.days_per_week === 5) {
    days = [
      { name: "Push", muscles: push }, { name: "Pull", muscles: pull }, { name: "Legs", muscles: lower },
      { name: "Upper", muscles: upper }, { name: "Lower", muscles: lower }
    ];
  } else {
    // 6 or 7 days
    days = [
      { name: "Push A", muscles: push }, { name: "Pull A", muscles: pull }, { name: "Legs A", muscles: lower },
      { name: "Push B", muscles: push }, { name: "Pull B", muscles: pull }, { name: "Legs B", muscles: lower }
    ];
  }

  // 5. Generate the Database-Ready Structure
  const splitName = `AI ${input.experience_level.charAt(0).toUpperCase() + input.experience_level.slice(1)} ${input.goal.replace("_", " ")} Split`;
  
  const generatedDays = days.map((day, dayIndex) => {
    const selectedExercises: string[] = [];
    
    // Cycle through required muscles to ensure balanced selection
    for (let i = 0; i < maxExercisesPerDay; i++) {
      const targetMuscle = day.muscles[i % day.muscles.length];
      const muscleOptions = eligibleExercises.filter(ex => 
        ex.muscle_group === targetMuscle && !selectedExercises.includes(ex.id)
      );
      
      if (muscleOptions.length > 0) {
        // Pick a random exercise for that muscle to keep routines fresh
        const randomEx = muscleOptions[Math.floor(Math.random() * muscleOptions.length)];
        selectedExercises.push(randomEx.id);
      }
    }

    return {
      day_index: dayIndex + 1 > 6 ? 0 : dayIndex + 1, // Map to Sunday(0)-Saturday(6) logically
      day_name: day.name,
      exercises: selectedExercises.map((exId, idx) => {
        // Fat loss rule: Group into supersets of 2 using identical order_indexes
        const isSuperset = input.goal === "fat_loss";
        const orderIndex = isSuperset ? Math.floor(idx / 2) : idx;

        return {
          exercise_id: exId,
          order_index: orderIndex,
          target_sets: config.sets,
          target_reps_min: config.minReps,
          target_reps_max: config.maxReps,
        };
      })
    };
  });

  return {
    name: splitName,
    days: generatedDays
  };
}