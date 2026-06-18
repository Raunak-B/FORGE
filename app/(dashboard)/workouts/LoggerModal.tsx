"use client";

import { useState } from "react";
import { logWorkout } from "./actions";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

type SetData = { reps: string; weight: string };

export default function LoggerModal({ children, exercise }: { children: React.ReactNode, exercise: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sets, setSets] = useState<SetData[]>([{ reps: "", weight: "" }]);

  const handleAddSet = () => setSets([...sets, { reps: "", weight: "" }]);

  const handleUpdateSet = (index: number, field: keyof SetData, value: string) => {
    const newSets = [...sets];
    newSets[index][field] = value;
    setSets(newSets);
  };

  const handleSave = async () => {
    // Filter out completely empty sets
    const validSets = sets.filter(s => s.reps !== "" && s.weight !== "");
    if (validSets.length === 0) {
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      await logWorkout(JSON.stringify({ exercise_id: exercise.id, sets: validSets }));
      setSets([{ reps: "", weight: "" }]); // Reset
      setIsOpen(false);
    } catch (e) {
      alert("Failed to save log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Area */}
      <div onClick={() => setIsOpen(true)}>{children}</div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-iron/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="w-full max-w-md bg-iron border border-steel/30 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl flex flex-col gap-6"
            >
              <div className="flex justify-between items-start">
                <h2 className="font-display text-3xl font-bold text-chalk uppercase">{exercise.name}</h2>
                <button onClick={() => setIsOpen(false)} className="text-steel hover:text-chalk text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded px-1">&times;</button>
              </div>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-12 gap-2 pb-2 border-b border-steel/20 text-xs text-steel font-mono uppercase tracking-widest">
                  <div className="col-span-2 text-center">Set</div>
                  <div className="col-span-5 text-center">kg</div>
                  <div className="col-span-5 text-center">Reps</div>
                </div>

                {sets.map((set, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-2 text-center font-mono text-steel">{idx + 1}</div>
                    <div className="col-span-5">
                      <input
                        type="number"
                        placeholder="0.0"
                        value={set.weight}
                        onChange={(e) => handleUpdateSet(idx, "weight", e.target.value)}
                        className="w-full text-center font-mono text-lg bg-iron/50 border border-steel/50 rounded-md py-2 text-chalk focus-visible:outline-none focus-visible:border-brass focus-visible:ring-1 focus-visible:ring-brass"
                      />
                    </div>
                    <div className="col-span-5">
                      <input
                        type="number"
                        placeholder="0"
                        value={set.reps}
                        onChange={(e) => handleUpdateSet(idx, "reps", e.target.value)}
                        className="w-full text-center font-mono text-lg bg-iron/50 border border-steel/50 rounded-md py-2 text-chalk focus-visible:outline-none focus-visible:border-brass focus-visible:ring-1 focus-visible:ring-brass"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleAddSet}
                className="w-full py-2 border-2 border-dashed border-steel/30 text-steel font-sans text-sm rounded-md hover:border-steel hover:text-chalk transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              >
                + Add Set
              </button>

              <Button onClick={handleSave} disabled={loading} className="w-full py-3 text-lg">
                {loading ? "Logging..." : "Log Exercise"}
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}