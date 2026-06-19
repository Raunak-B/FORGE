import { createClient } from "@/lib/supabase/server";
import Container from "@/components/ui/Container";
import FeedClient from "./FeedClient";
import Composer from "./Composer";
import PostCard from "./PostCard";

export const metadata = { title: "Community | Forge" };

export default async function CommunityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch posts with necessary joined tables
  const { data: posts } = await supabase
    .from("posts")
    .select(`
      id, content, image_url, created_at,
      profiles ( id, full_name, avatar_url ),
      post_likes ( user_id ),
      post_comments (
        id, content, created_at,
        profiles ( full_name )
      )
    `)
    .order("created_at", { ascending: false });

  // Ensure posts array exists and sort comments oldest-to-newest
  const formattedPosts = (posts || []).map(post => ({
    ...post,
    post_comments: post.post_comments?.sort((a: any, b: any) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
  }));

  return (
    <Container className="py-10 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        
        <div className="border-b border-steel/20 pb-6">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-chalk uppercase tracking-wide">
            The Alliance
          </h1>
          <p className="font-sans text-steel mt-1">
            Compare progress, not egos. Drop your updates below.
          </p>
        </div>

        <Composer />

        <FeedClient>
          {formattedPosts.length > 0 ? (
            formattedPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                currentUserId={user?.id || ""} 
              />
            ))
          ) : (
            <div className="text-center py-12 text-steel font-sans italic">
              The forge is quiet. Be the first to strike the iron.
            </div>
          )}
        </FeedClient>

      </div>
    </Container>
  );
}