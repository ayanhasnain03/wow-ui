"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { MessageContainer } from "@/modules/project/ui/components/messages-container";
import { Suspense } from "react";

interface Props {
  projectId: string;
}
export const ProjectView = ({ projectId }: Props) => {
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={25}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<div>Loading Messages...</div>}>
            <MessageContainer projectId={projectId} />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={65}
          minSize={50}
          className="flex flex-col min-h-0"
        >
          TODO: PREVIEW
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
