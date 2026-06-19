"use client";

import Card from "@/components/ui/Card";
import { useReducedMotion } from "framer-motion";
import { NutritionTargets } from "./actions";

export default function DailySummary({ 
  targets, 
  logged 
}: { 
  targets: NutritionTargets; 
  logged: NutritionTargets 
}) {
  const shouldReduceMotion = useReducedMotion();

  const macros = [
    { label: "Calories", current: logged.calories, target: targets.calories, color: "bg-plate", unit: "kcal" },
    { label: "Protein", current: logged.protein, target: targets.protein, color: "bg-brass", unit: "g" },
    { label: "Carbs", current: logged.carbs, target: targets.carbs, color: "bg-chalk", unit: "g" },
    { label: "Fat", current: logged.fat, target: targets.fat, color: "bg-steel", unit: "g" },
  ];

  return (
    <Card className="flex flex-col gap-8">
      <h2 className="font-display text-3xl font-bold text-chalk uppercase tracking-wide">
        Daily Protocol
      </h2>

      <div className="flex flex-col gap-6">
        {macros.map((macro) => {
          const percentage = Math.min((macro.current / macro.target) * 100, 100);
          
          return (
            <div key={macro.label} className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="font-sans font-bold text-chalk uppercase tracking-widest text-sm">
                  {macro.label}
                </span>
                <div className="font-mono text-sm">
                  <span className={macro.current > macro.target ? "text-plate" : "text-chalk"}>
                    {macro.current}
                  </span>
                  <span className="text-steel"> / {macro.target}{macro.unit}</span>
                </div>
              </div>

              {/* The Plate-Stack Progress Bar */}
              <div className="h-4 w-full bg-iron/80 rounded border border-steel/30 overflow-hidden relative">
                <div
                  className={`h-full ${macro.color} transition-all duration-700 ease-out`}
                  style={{ 
                    width: `${percentage}%`,
                    // Creates the vertical "plate grooving" effect
                    backgroundImage: `repeating-linear-gradient(to right, transparent, transparent 6px, rgba(0,0,0,0.15) 6px, rgba(0,0,0,0.15) 8px)`,
                    transition: shouldReduceMotion ? "none" : "width 0.7s ease-out"
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}