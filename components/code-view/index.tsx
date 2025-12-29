import Prism from "prismjs";
import { useEffect, useRef } from "react";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-bash";

import "./code-theme.css";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  code: string;
  lang: string;
}

export const CodeView = ({ code, lang }: Props) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, lang]);

  return (
    <div className="relative h-full w-full code-container bg-background overflow-hidden">
      <ScrollArea className="h-full w-full">
        <pre
          className={cn(
            "m-0 py-5 px-6",
            "font-mono text-sm leading-[1.75]",
            "bg-background text-foreground",
            "relative",
            "block",
            "min-w-full"
          )}
          style={{
            tabSize: 2,
            // @ts-expect-error - WebkitTabSize is not a valid property
            WebkitTabSize: 2
          }}
        >
          <code
            ref={codeRef}
            className={cn(
              `language-${lang}`,
              "block",
              "text-sm",
              "whitespace-pre",
              "overflow-x-auto",
              "min-w-full"
            )}
          >
            {code}
          </code>
        </pre>
      </ScrollArea>
    </div>
  );
};
