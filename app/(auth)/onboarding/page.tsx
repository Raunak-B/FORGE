"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { completeOnboarding } from "../actions";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const steps = [
  { id: "stats", title: "Vital Stats" },
  { id: "profile", title: "Fitness Profile" },
  { id: "commitment", title: "Commitment" },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg overflow-hidden">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-chalk text-center uppercase tracking-wide">
            {steps[currentStep].title}
          </h1>
          <div className="mt-4 flex justify-between gap-2">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  idx <= currentStep ? "bg-plate" : "bg-steel/30"
                }`}
              />
            ))}
          </div>
        </div>

        <form action={completeOnboarding}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              {currentStep === 0 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-chalk/80">Age</label>
                      <input
                        name="age"
                        type="number"
                        required
                        min="13"
                        max="100"
                        className="font-mono rounded-md border border-steel/50 bg-iron/50 px-3 py-2 text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-chalk/80">Sex</label>
                      <select
                        name="sex"
                        required
                        className="rounded-md border border-steel/50 bg-iron/50 px-3 py-2 text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-chalk/80">Height (cm)</label>
                      <input
                        name="height_cm"
                        type="number"
                        step="0.1"
                        required
                        className="font-mono rounded-md border border-steel/50 bg-iron/50 px-3 py-2 text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-chalk/80">Weight (kg)</label>
                      <input
                        name="weight_kg"
                        type="number"
                        step="0.1"
                        required
                        className="font-mono rounded-md border border-steel/50 bg-iron/50 px-3 py-2 text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                      />
                    </div>
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-chalk/80">Primary Goal</label>
                    <select
                      name="goal"
                      required
                      className="rounded-md border border-steel/50 bg-iron/50 px-3 py-2 text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                    >
                      <option value="hypertrophy">Hypertrophy (Build Muscle)</option>
                      <option value="strength">Strength (Lift Heavier)</option>
                      <option value="fat_loss">Fat Loss</option>
                      <option value="endurance">Endurance</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-chalk/80">Experience Level</label>
                    <select
                      name="experience_level"
                      required
                      className="rounded-md border border-steel/50 bg-iron/50 px-3 py-2 text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-chalk/80">Daily Activity Level</label>
                    <select
                      name="activity_level"
                      required
                      className="rounded-md border border-steel/50 bg-iron/50 px-3 py-2 text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                    >
                      <option value="sedentary">Sedentary</option>
                      <option value="light">Light Activity</option>
                      <option value="moderate">Moderate Activity</option>
                      <option value="active">Active</option>
                      <option value="very_active">Very Active</option>
                    </select>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-chalk/80">Days per week</label>
                    <input
                      name="days_per_week"
                      type="number"
                      required
                      min="1"
                      max="7"
                      defaultValue="3"
                      className="font-mono rounded-md border border-steel/50 bg-iron/50 px-3 py-2 text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-chalk/80">Minutes per session</label>
                    <input
                      name="minutes_per_session"
                      type="number"
                      required
                      step="15"
                      min="15"
                      max="180"
                      defaultValue="45"
                      className="font-mono rounded-md border border-steel/50 bg-iron/50 px-3 py-2 text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                    />
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between gap-4">
            {currentStep > 0 ? (
              <Button type="button" variant="ghost" onClick={prevStep} className="w-1/3">
                Back
              </Button>
            ) : (
              <div className="w-1/3" /> /* Spacer */
            )}

            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep} className="w-2/3">
                Continue
              </Button>
            ) : (
              <Button type="submit" className="w-2/3 group relative overflow-hidden">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Generate My Plan
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}