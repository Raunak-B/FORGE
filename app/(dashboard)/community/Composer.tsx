"use client";

import { useRef, useState } from "react";
import { createPost } from "./actions";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function Composer() {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setPending(true);
    await createPost(formData);
    formRef.current?.reset();
    setFileName(null);
    setPending(false);
  };

  return (
    <Card className="p-0 overflow-hidden">
      <form action={handleSubmit} ref={formRef} className="flex flex-col">
        <textarea
          name="content"
          required
          placeholder="What's your current protocol?"
          className="w-full resize-none bg-transparent p-6 text-chalk placeholder:text-steel focus-visible:outline-none min-h-[120px]"
        />
        
        <div className="flex items-center justify-between bg-iron/80 px-6 py-3 border-t border-steel/20">
          <label className="cursor-pointer text-steel hover:text-brass transition-colors flex items-center gap-2 text-sm font-sans focus-within:ring-2 focus-within:ring-brass rounded px-1">
            <input 
              type="file" 
              name="image" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
            />
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {fileName ? <span className="text-chalk max-w-[120px] truncate">{fileName}</span> : "Attach Image"}
          </label>
          
          <Button type="submit" disabled={pending}>
            {pending ? "Transmitting..." : "Post"}
          </Button>
        </div>
      </form>
    </Card>
  );
}