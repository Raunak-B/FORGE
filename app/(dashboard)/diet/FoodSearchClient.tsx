"use client";

import { useState, useEffect } from "react";
import { searchFood, logFood } from "./actions";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function FoodSearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<any | null>(null);
  const [quantityStr, setQuantityStr] = useState("100");

  // Debounced search
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (query.length > 2) {
        setLoading(true);
        try {
          const data = await searchFood(query);
          setResults(data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [query]);

  const handleLog = async () => {
    if (!selectedFood) return;
    
    // Scale macros based on user quantity vs USDA serving size
    const qty = parseFloat(quantityStr) || 0;
    const ratio = qty / selectedFood.servingSize;

    const entry = {
      name: selectedFood.name,
      quantity: `${qty}${selectedFood.servingUnit}`,
      calories: Math.round(selectedFood.calories * ratio),
      protein: Math.round(selectedFood.protein * ratio),
      carbs: Math.round(selectedFood.carbs * ratio),
      fat: Math.round(selectedFood.fat * ratio),
    };

    try {
      await logFood(JSON.stringify(entry));
      setQuery("");
      setResults([]);
      setSelectedFood(null);
    } catch (e) {
      alert("Failed to log food.");
    }
  };

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="font-display text-2xl font-bold text-chalk uppercase tracking-wide">
        Log Intake
      </h2>

      <div className="relative">
        <input
          type="text"
          placeholder="Search food database..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-steel/50 bg-iron/50 px-4 py-3 text-chalk placeholder:text-steel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass shadow-sm"
        />
        
        {loading && (
          <span className="absolute right-4 top-3 text-steel font-mono text-sm animate-pulse">
            Searching...
          </span>
        )}

        {/* Search Dropdown */}
        {results.length > 0 && !selectedFood && (
          <ul className="absolute top-full mt-1 w-full bg-iron border border-steel/50 rounded-md overflow-hidden z-20 shadow-xl max-h-60 overflow-y-auto">
            {results.map((food) => (
              <li 
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className="px-4 py-3 hover:bg-steel/20 cursor-pointer border-b border-steel/20 last:border-0"
              >
                <div className="flex flex-col">
                  <span className="text-chalk font-sans font-bold line-clamp-1">{food.name}</span>
                  <span className="text-steel font-mono text-xs mt-0.5">
                    {food.brand ? `${food.brand} • ` : ""} {food.calories}kcal / {food.servingSize}{food.servingUnit}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selected Food Logging Form */}
      {selectedFood && (
        <div className="mt-4 p-4 rounded-lg bg-iron border border-brass/30 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-chalk">{selectedFood.name}</h3>
              <span className="text-steel font-mono text-xs">
                Base: {selectedFood.servingSize}{selectedFood.servingUnit}
              </span>
            </div>
            <button 
              onClick={() => setSelectedFood(null)}
              className="text-steel hover:text-plate font-sans text-sm"
            >
              Cancel
            </button>
          </div>

          <div className="flex items-end gap-4">
            <div className="flex flex-col gap-1 w-1/3">
              <label className="text-xs text-steel uppercase tracking-widest font-sans">
                Quantity ({selectedFood.servingUnit})
              </label>
              <input
                type="number"
                value={quantityStr}
                onChange={(e) => setQuantityStr(e.target.value)}
                className="w-full font-mono bg-iron/50 border border-steel/30 rounded px-3 py-2 text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              />
            </div>
            
            <Button onClick={handleLog} className="w-2/3">
              Log Data
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}