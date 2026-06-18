import { createClient } from "@/lib/supabase/server";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import VolumeChart from "./VolumeChart";
import MuscleChart from "./MuscleChart";

// Type definition for Supabase join shape
type RawLog = {
  performed_at: string;
  exercises: { id: string; name: string; muscle_group: string };
  log_sets: { reps: number; weight_kg: number }[];
};

export const metadata = { title: "Analytics | Forge" };

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch all logs with joined data for the user
  const { data: rawData } = await supabase
    .from("workout_logs")
    .select(`
      performed_at,
      exercises ( id, name, muscle_group ),
      log_sets ( reps, weight_kg )
    `)
    .eq("user_id", user?.id)
    .order("performed_at", { ascending: false });

  const logs = (rawData as unknown as RawLog[]) || [];

  // --- 1. STREAK CALCULATION (Weekly) ---
  // A streak continues if a workout happened in the current or previous week.
  const getWeekId = (dateString: string) => {
    const d = new Date(dateString);
    // Rough week identifier (Sunday to Saturday)
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay()); 
    return d.getTime();
  };

  const activeWeeks = [...new Set(logs.map(log => getWeekId(log.performed_at)))].sort((a, b) => b - a);
  let streak = 0;
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const currentWeekId = getWeekId(new Date().toISOString());

  if (activeWeeks.length > 0) {
    // If the latest logged week is this week or last week, start counting
    if (activeWeeks[0] === currentWeekId || activeWeeks[0] === currentWeekId - ONE_WEEK_MS) {
      streak = 1;
      for (let i = 1; i < activeWeeks.length; i++) {
        if (activeWeeks[i - 1] - activeWeeks[i] === ONE_WEEK_MS) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  // --- 2. PERSONAL RECORDS ---
  // Highest weight per exercise. If weights tie, highest reps wins.
  const prs: Record<string, { name: string; weight: number; reps: number; date: string }> = {};
  logs.forEach(log => {
    if (!log.exercises) return;
    const exId = log.exercises.id;
    
    log.log_sets.forEach(set => {
      const currentPR = prs[exId];
      if (!currentPR || set.weight_kg > currentPR.weight || (set.weight_kg === currentPR.weight && set.reps > currentPR.reps)) {
        prs[exId] = {
          name: log.exercises.name,
          weight: set.weight_kg,
          reps: set.reps,
          date: log.performed_at
        };
      }
    });
  });
  // Sort PRs alphabetically by exercise name
  const prList = Object.values(prs).sort((a, b) => a.name.localeCompare(b.name));

  // --- 3. VOLUME CHART (Last 12 Weeks) ---
  const volumeData = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (11 - i) * 7); // Go back 11-i weeks
    const month = d.toLocaleString('default', { month: 'short' });
    const day = d.getDate();
    return { week: `${month} ${day}`, volume: 0, _date: d };
  });

  const twelveWeeksAgo = new Date();
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 12 * 7);

  logs.forEach(log => {
    const logDate = new Date(log.performed_at);
    if (logDate >= twelveWeeksAgo) {
      // Find which bucket it belongs to
      const bucketIndex = volumeData.findIndex((bucket, i) => {
        const nextBucketDate = volumeData[i + 1]?._date;
        return logDate >= bucket._date && (!nextBucketDate || logDate < nextBucketDate);
      });
      
      if (bucketIndex !== -1) {
        const sessionVolume = log.log_sets.reduce((sum, set) => sum + (set.weight_kg * set.reps), 0);
        volumeData[bucketIndex].volume += sessionVolume;
      }
    }
  });

  // --- 4. MUSCLE GROUP SETS (Last 30 Days) ---
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const muscleSets: Record<string, number> = {};
  logs.forEach(log => {
    if (!log.exercises) return;
    const logDate = new Date(log.performed_at);
    if (logDate >= thirtyDaysAgo) {
      const group = log.exercises.muscle_group.replace("_", " ");
      muscleSets[group] = (muscleSets[group] || 0) + log.log_sets.length;
    }
  });

  const muscleData = Object.entries(muscleSets)
    .map(([muscle, sets]) => ({ muscle, sets }))
    .sort((a, b) => b.sets - a.sets); // Sort descending by sets

  return (
    <Container className="py-10 flex flex-col gap-8">
      {/* Header & Streak */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-steel/20 pb-6">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-chalk uppercase tracking-wide">
            Analytics
          </h1>
          <p className="font-sans text-steel mt-1">Review your volume, records, and consistency.</p>
        </div>
        <div className="flex items-center gap-4 bg-iron/50 border border-brass/30 px-5 py-3 rounded-xl shadow-[0_0_15px_rgba(201,154,61,0.1)]">
          <div className="flex flex-col items-end">
            <span className="text-steel font-sans text-xs uppercase tracking-widest">Active Streak</span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-3xl font-bold text-brass">{streak}</span>
              <span className="font-sans text-chalk/70 text-sm">WEEKS</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Area Chart */}
        <Card className="flex flex-col">
          <div className="flex flex-col">
            <h2 className="font-display text-2xl uppercase tracking-widest text-chalk">Total Volume</h2>
            <span className="font-sans text-sm text-steel">Last 12 Weeks (kg)</span>
          </div>
          {volumeData.some(d => d.volume > 0) ? (
            <VolumeChart data={volumeData} />
          ) : (
            <div className="h-72 flex items-center justify-center text-steel italic">Not enough data.</div>
          )}
        </Card>

        {/* Muscle Group Bar Chart */}
        <Card className="flex flex-col">
          <div className="flex flex-col">
            <h2 className="font-display text-2xl uppercase tracking-widest text-chalk">Volume Distribution</h2>
            <span className="font-sans text-sm text-steel">Sets per muscle group (Last 30 Days)</span>
          </div>
          {muscleData.length > 0 ? (
            <MuscleChart data={muscleData} />
          ) : (
            <div className="h-72 flex items-center justify-center text-steel italic">Not enough data.</div>
          )}
        </Card>
      </div>

      {/* Personal Records Table */}
      <div className="flex flex-col gap-4 mt-4">
        <h2 className="font-display text-3xl uppercase tracking-widest text-chalk">Personal Records</h2>
        <Card className="p-0 overflow-hidden">
          {prList.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left font-sans">
                <thead className="bg-iron/80 border-b border-steel/30 text-steel text-xs uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4 font-medium">Exercise</th>
                    <th className="px-6 py-4 font-medium text-right">Max Weight</th>
                    <th className="px-6 py-4 font-medium text-right">Reps</th>
                    <th className="px-6 py-4 font-medium text-right">Date Achieved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-steel/10">
                  {prList.map((pr, idx) => (
                    <tr key={idx} className="hover:bg-steel/5 transition-colors">
                      <td className="px-6 py-4 text-chalk font-bold uppercase">{pr.name}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-mono text-lg text-plate">{pr.weight}</span>
                        <span className="text-steel text-xs ml-1">kg</span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-chalk/80">{pr.reps}</td>
                      <td className="px-6 py-4 text-right font-mono text-steel text-sm">
                        {new Date(pr.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-steel italic">
              Log some workouts to establish your baselines.
            </div>
          )}
        </Card>
      </div>
    </Container>
  );
}