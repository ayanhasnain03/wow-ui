"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MessageContainer } from "@/modules/project/ui/components/messages-container";
import { Suspense, useState } from "react";
import { Fragment } from "@/lib/generated/prisma/browser";
import { ProjectHeader } from "../components/project-header";
import { FragmentWeb } from "../components/fragment-web";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, EyeIcon } from "lucide-react";
import { FileExplorer } from "@/components/file-explorer";
import { cn } from "@/lib/utils";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <ProjectHeader projectId={projectId} />

      <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
        {/* LEFT PANEL - Messages */}
        <ResizablePanel
          defaultSize={38}
          minSize={28}
          maxSize={50}
          className="flex flex-col min-h-0 border-r border-border/30 bg-muted/20"
        >
          <div className="flex-1 min-h-0 overflow-hidden">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-3">
                    <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading messages...</p>
                  </div>
                </div>
              }
            >
              <MessageContainer
                projectId={projectId}
                activeFragment={activeFragment}
                setActiveFragment={setActiveFragment}
              />
            </Suspense>
          </div>
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="w-0.5 bg-border/30 hover:bg-border/50 transition-colors group"
        />

        {/* RIGHT PANEL - Preview/Code */}
        <ResizablePanel
          defaultSize={62}
          minSize={50}
          className="flex flex-col min-h-0 bg-background"
        >
          <Tabs
            value={tabState}
            onValueChange={(v) => setTabState(v as "preview" | "code")}
            className="flex flex-col h-full min-h-0"
          >
            {/* Tabs Header */}
            <div className="flex items-center justify-between gap-4 border-b border-border/30 bg-background/95 backdrop-blur-md px-6 py-3.5">
              <TabsList className="h-10">
                <TabsTrigger
                  value="preview"
                  className="px-4"
                >
                  <EyeIcon className="size-4 mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className="px-4"
                >
                  <CodeIcon className="size-4 mr-2" />
                  Code
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tabs Content */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <TabsContent
                value="preview"
                className={cn(
                  "h-full m-0 data-[state=inactive]:hidden",
                  "flex items-center justify-center",
                  !activeFragment && "bg-gradient-to-br from-muted/30 via-muted/20 to-transparent"
                )}
              >
                {activeFragment ? (
                  <FragmentWeb data={activeFragment} />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-center px-6 max-w-md">
                    <div className="size-16 rounded-2xl bg-muted/60 border border-border/30 flex items-center justify-center mb-2">
                      <EyeIcon className="size-7 text-muted-foreground/60" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-base font-semibold text-foreground">
                        No preview available
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Select a message with a fragment to view the preview
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent
                value="code"
                className={cn(
                  "h-full m-0 data-[state=inactive]:hidden",
                  "flex items-center justify-center",
                  !activeFragment?.files && "bg-gradient-to-br from-muted/30 via-muted/20 to-transparent"
                )}
              >
                {activeFragment?.files ? (
                  <FileExplorer
                    files={JSON.parse(activeFragment.files as string)}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-center px-6 max-w-md">
                    <div className="size-16 rounded-2xl bg-muted/60 border border-border/30 flex items-center justify-center mb-2">
                      <CodeIcon className="size-7 text-muted-foreground/60" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-base font-semibold text-foreground">
                        No code available
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Select a message with code files to view the source
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
