import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Fragment } from "@/lib/generated/prisma/client";
import { ExternalLinkIcon, RefreshCwIcon } from "lucide-react";
import { useState } from "react";

interface Props {
  data: Fragment;
}

export function FragmentWeb({ data }: Props) {
  const [copied, setCopied] = useState(false);
  const [fragmentKey, setFragmentKey] = useState(0);

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex flex-col w-full h-full min-h-0 bg-background">
      <div className="px-5 py-3.5 border-b border-border/30 bg-background/95 backdrop-blur-md flex items-center gap-2.5 shrink-0">
        <Hint text="Refresh preview" side="bottom" align="start">
          <Button
            size="sm"
            variant="outline"
            onClick={onRefresh}
            className="h-8 w-8 p-0 border-border/40 hover:bg-muted/80 transition-colors"
          >
            <RefreshCwIcon className="size-4" />
          </Button>
        </Hint>
        <Hint text="Click to copy URL">
          <Button
            size="sm"
            variant="outline"
            disabled={!data.sandboxUrl || copied}
            onClick={handleCopy}
            className="flex-1 justify-start text-start font-normal h-8 border-border/40 text-xs hover:bg-muted/80 transition-colors"
          >
            <span className="truncate font-mono">
              {copied ? "Copied!" : (data.sandboxUrl || "No URL available")}
            </span>
          </Button>
        </Hint>
        <Hint text="Open in new tab" side="bottom" align="start">
          <Button
            size="sm"
            disabled={!data.sandboxUrl}
            variant="outline"
            onClick={() => {
              if (!data.sandboxUrl) return;
              window.open(data.sandboxUrl, "_blank");
            }}
            className="h-8 w-8 p-0 border-border/40 hover:bg-muted/80 transition-colors disabled:opacity-40"
          >
            <ExternalLinkIcon className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden bg-muted/10">
        <iframe
          key={fragmentKey}
          className="w-full h-full border-0 bg-white dark:bg-background"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          loading="lazy"
          src={data.sandboxUrl}
          title="Preview"
        />
      </div>
    </div>
  );
}
