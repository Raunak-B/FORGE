import { createClient } from "@/lib/supabase/server";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import { calculateTargets, NutritionTargets } from "./actions";
import DailySummary from "./DailySummary";
import FoodSearchClient from "./FoodSearchClient";

export const metadata = { title: "Diet | Forge" };

export default async function DietDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch Profile & Calculate Targets
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  let targets: NutritionTargets = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  if (profile) {
    targets = await calculateTargets(profile);
  }

  // 2. Fetch Today's Logs
  // Get start of today in ISO format for querying
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data: logs } = await supabase
    .from("diet_logs")
    .select("*")
    .eq("user_id", user?.id)
    .gte("logged_at", today.toISOString())
    .order("logged_at", { ascending: false });

  // 3. Aggregate Current Intake
  const currentIntake = (logs || []).reduce(
    (acc, log) => ({
      calories: acc.calories + Number(log.calories),
      protein: acc.protein + Number(log.protein_g),
      carbs: acc.carbs + Number(log.carbs_g),
      fat: acc.fat + Number(log.fat_g),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <Container className="py-10 flex flex-col gap-8">
      <div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-chalk uppercase tracking-wide">
          Fuel & Macros
        </h1>
        <p className="font-sans text-steel mt-1">
          Track intake and match targets to support adaptation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Progress */}
        <div className="flex flex-col gap-6">
          <DailySummary targets={targets} logged={currentIntake} />
        </div>

        {/* Right Column: Logging & History */}
        <div className="flex flex-col gap-6">
          <FoodSearchClient />

          <div className="flex flex-col gap-4 mt-2">
            <h3 className="font-display text-2xl font-bold text-chalk uppercase tracking-wide">
              Today's Log
            </h3>
            
            {logs && logs.length > 0 ? (
              <div className="flex flex-col gap-3">
                {logs.map((log) => (
                  <Card key={log.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-l-4 border-l-brass">
                    <div className="flex flex-col">
                      <span className="font-bold text-chalk">{log.food_name}</span>
                      <span className="text-steel font-mono text-xs">{log.quantity}</span>
                    </div>
                    
                    <div className="flex gap-4 font-mono text-sm">
                      <div className="flex flex-col items-center">
                        <span className="text-steel text-[10px]">Cals</span>
                        <span className="text-chalk">{Math.round(log.calories)}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-steel text-[10px]">Pro</span>
                        <span className="text-brass">{Math.round(log.protein_g)}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-steel text-[10px]">Carb</span>
                        <span className="text-chalk/70">{Math.round(log.carbs_g)}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-steel text-[10px]">Fat</span>
                        <span className="text-steel">{Math.round(log.fat_g)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="py-8 text-center bg-iron/30">
                <p className="text-steel italic font-sans text-sm">No entries logged today.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}