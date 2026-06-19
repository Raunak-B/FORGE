"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Force plain text conversion, removing any accidental HTML payload
  const content = (formData.get("content") as string)?.replace(/<[^>]*>?/gm, "");
  const image = formData.get("image") as File | null;
  let image_url = null;

  if (image && image.size > 0) {
    const ext = image.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${ext}`;
    
    const { error: uploadError } = await supabase.storage
      .from("community-images")
      .upload(fileName, image);
      
    if (!uploadError) {
      const { data } = supabase.storage.from("community-images").getPublicUrl(fileName);
      image_url = data.publicUrl;
    }
  }

  await supabase.from("posts").insert({ user_id: user.id, content, image_url });
  revalidatePath("/community");
}

export async function toggleLike(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single();
  
  if (data) {
    await supabase.from("post_likes").delete().eq("id", data.id);
  } else {
    await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
  }
  revalidatePath("/community");
}

export async function addComment(postId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const content = (formData.get("content") as string)?.replace(/<[^>]*>?/gm, "");
  if (!content) return;

  await supabase.from("post_comments").insert({ post_id: postId, user_id: user.id, content });
  revalidatePath("/community");
}

export async function reportPost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("reports").insert({ 
    post_id: postId, 
    reporter_id: user.id, 
    reason: "Flagged by user in feed" 
  });
}