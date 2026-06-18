import { createClient } from "@/lib/supabase/server";
import Container from "@/components/ui/Container";
import SplitBuilder from "./SplitBuilder";

export default async function CreateSplitPage() {
  const supabase = await createClient();
  
  // Fetch exercises for the selection dropdown
  const { data: exercises } = await supabase
    .from("exercises")
    .select("id, name, muscle_group")
    .order("name");

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-chalk uppercase">Create Routine</h1>
        <p className="font-sans text-steel">Design your training split and target volumes.</p>
      </div>
      
      <SplitBuilder exercises={exercises || []} />
    </Container>
  );
}