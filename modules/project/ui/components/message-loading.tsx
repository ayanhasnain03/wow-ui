"use client";

import Image from "next/image";
import { useEffect, useState, useMemo, useRef } from "react";

const TypingCursor = () => {
  return (
    <span
      className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse"
      aria-hidden="true"
    />
  );
};

const TypingText = () => {
  const sampleTexts = useMemo(
    () => [
      "I'm analyzing your request and preparing a response...",
      "Let me think through this step by step...",
      "Processing the information and generating insights...",
      "Working on crafting the perfect solution for you...",
      "Almost there, just putting the finishing touches...",
    ],
    []
  );

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeedRef = useRef(30);

  useEffect(() => {
    const currentText = sampleTexts[currentTextIndex];

    let timeoutId: NodeJS.Timeout;

    if (!isDeleting && displayedText.length < currentText.length) {
      // Typing forward
      typingSpeedRef.current = 30 + Math.random() * 50; // Variable speed for realism
      timeoutId = setTimeout(() => {
        setDisplayedText(currentText.slice(0, displayedText.length + 1));
      }, typingSpeedRef.current);
    } else if (!isDeleting && displayedText.length === currentText.length) {
      // Finished typing, wait then start deleting
      timeoutId = setTimeout(() => {
        setIsDeleting(true);
        typingSpeedRef.current = 15;
      }, 2000);
    } else if (isDeleting && displayedText.length > 0) {
      // Deleting
      timeoutId = setTimeout(() => {
        setDisplayedText(currentText.slice(0, displayedText.length - 1));
      }, typingSpeedRef.current);
    } else if (isDeleting && displayedText.length === 0) {
      // Finished deleting, move to next text
      timeoutId = setTimeout(() => {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % sampleTexts.length);
        typingSpeedRef.current = 30;
      }, 0);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    displayedText,
    isDeleting,
    currentTextIndex,
    sampleTexts,
  ]);

  return (
    <div className="flex items-start min-h-6">
      <span className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap wrap-break-word">
        {displayedText}
        <TypingCursor />
      </span>
    </div>
  );
};

export const MessageLoading = () => {
  return (
    <div
      className="relative pb-5 px-4"
      role="status"
      aria-live="polite"
      aria-label="Loading message"
    >
      <div className="flex items-center gap-3 py-3">
        <div className="flex size-8 items-center justify-center rounded-lg border bg-background border-border/40 shadow-sm">
          <Image
            src="/logo.svg"
            alt="VIBE"
            width={18}
            height={18}
            className="shrink-0"
          />
        </div>

        <div className="flex items-baseline gap-2.5">
          <span className="text-sm font-semibold text-primary">VIBE</span>
        </div>
      </div>

      <div className="pl-10">
        <TypingText />
      </div>
    </div>
  );
};
