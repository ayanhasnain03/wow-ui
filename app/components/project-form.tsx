"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Loader2, SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectFormProps {
  onSubmit: (value: string) => void;
  isPending: boolean;
}

export const ProjectForm = ({ onSubmit, isPending }: ProjectFormProps) => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      setValue("");
    }
  };

  const isEmpty = !value.trim();

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div
        className={cn(
          "relative rounded-2xl border transition-all duration-300",
          "bg-background/50 backdrop-blur-sm",
          isFocused
            ? "border-primary/40 shadow-xl shadow-primary/5 ring-1 ring-primary/10"
            : "border-border/40 shadow-sm hover:border-border/60"
        )}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <Textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Describe what you want to build...&#10;&#10;Example: Create a todo app with drag and drop functionality"
                className={cn(
                  "min-h-[120px] resize-none border-0 bg-transparent text-foreground",
                  "placeholder:text-muted-foreground/50",
                  "focus:ring-0 focus-visible:outline-none",
                  "text-base leading-relaxed",
                  "scrollbar-thin scrollbar-thumb-border/30 scrollbar-track-transparent"
                )}
                disabled={isPending}
              />
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 flex items-center justify-between gap-4 border-t border-border/30 bg-muted/20">
          <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
            <SparklesIcon className="size-3.5" />
            <span>AI will generate your project</span>
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={isEmpty || isPending}
            className={cn(
              "min-w-[140px] transition-all duration-200",
              isEmpty
                ? "opacity-50 cursor-not-allowed"
                : "opacity-100 hover:scale-105 active:scale-95"
            )}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <SparklesIcon className="size-4 mr-2" />
                Create Project
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

