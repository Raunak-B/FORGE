"use client";

import { useState, useEffect } from "react";
import { toggleLike, addComment, reportPost } from "./actions";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function PostCard({ post, currentUserId }: { post: any, currentUserId: string }) {
  const shouldReduceMotion = useReducedMotion();
  
  // Local state synced with props for immediate optimistic UI updates
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    setIsLiked(post.post_likes?.some((like: any) => like.user_id === currentUserId));
    setLikeCount(post.post_likes?.length || 0);
  }, [post, currentUserId]);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    await toggleLike(post.id);
  };

  const handleReport = async () => {
    if (confirm("Flag this post for review?")) {
      setReported(true);
      await reportPost(post.id);
    }
  };

  const formatDate = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return hours === 0 ? "Just now" : `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-steel/30 border border-steel/50 flex items-center justify-center font-display text-lg text-chalk uppercase overflow-hidden">
            {post.profiles?.avatar_url ? (
              <img src={post.profiles.avatar_url} alt="Avatar" className="object-cover h-full w-full" />
            ) : (
              (post.profiles?.full_name || "A")[0]
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-chalk capitalize">{post.profiles?.full_name || "Anonymous Lifter"}</span>
            <span className="font-mono text-xs text-steel">{formatDate(post.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Body (Plain Text Rendered Safely) */}
      <p className="font-sans text-chalk/90 leading-relaxed whitespace-pre-wrap break-words">
        {post.content}
      </p>

      {/* Image Attachment using standard img to avoid Next.js Config Hostname errors */}
      {post.image_url && (
        <div className="mt-2 rounded-lg overflow-hidden border border-steel/30 bg-iron/50">
          <img src={post.image_url} alt="Community Post" loading="lazy" className="max-h-[500px] w-full object-contain" />
        </div>
      )}

      {/* Footer Controls */}
      <div className="flex items-center justify-between border-t border-steel/20 pt-4 mt-2">
        <div className="flex items-center gap-6">
          <button onClick={handleLike} className={`flex items-center gap-2 font-mono text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded px-1 ${isLiked ? "text-plate" : "text-steel hover:text-chalk"}`}>
            <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            {likeCount}
          </button>
          
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 font-mono text-sm text-steel hover:text-chalk transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded px-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            {post.post_comments?.length || 0}
          </button>
        </div>

        <button onClick={handleReport} disabled={reported} className="text-xs text-steel hover:text-plate font-sans uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded px-1">
          {reported ? "Reported" : "Report"}
        </button>
      </div>

      {/* Expandable Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
            className="overflow-hidden border-t border-steel/20 flex flex-col gap-4 pt-4 mt-2"
          >
            {post.post_comments?.length > 0 ? (
              <div className="flex flex-col gap-4 max-h-60 overflow-y-auto pr-2">
                {post.post_comments.map((comment: any) => (
                  <div key={comment.id} className="flex flex-col bg-iron/50 p-3 rounded-lg border border-steel/10">
                    <span className="font-sans font-bold text-chalk text-sm capitalize">{comment.profiles?.full_name || "Anonymous"}</span>
                    <span className="font-sans text-chalk/80 text-sm whitespace-pre-wrap">{comment.content}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-steel font-sans text-sm italic">No comments yet.</span>
            )}

            <form action={(formData) => { addComment(post.id, formData); (document.getElementById(`comment-${post.id}`) as HTMLInputElement).value = ''; }} className="flex gap-2">
              <input 
                id={`comment-${post.id}`}
                name="content" 
                required 
                placeholder="Add a comment..." 
                className="flex-1 rounded-md border border-steel/50 bg-iron/50 px-3 py-2 text-sm text-chalk placeholder:text-steel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              />
              <Button type="submit" variant="ghost">Send</Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}