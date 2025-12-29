"use client";

import { CopyCheckIcon, CopyIcon, FileIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CodeView } from "@/components/code-view";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { convertFilesToTreeItems } from "@/lib/utils";
import { TreeView } from "./tree-view";

type FileCollection = { [path: string]: string };

function getLanguageExt(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  return ext || "text";
}

interface FileExplorerProps {
  files: FileCollection;
}

export const FileExplorer = ({ files }: FileExplorerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });
  const [copied, setCopied] = useState(false);

  const treeData = useMemo(() => {
    return convertFilesToTreeItems(files);
  }, [files]);

  const handleFileSelect = useCallback(
    (filePath: string) => {
      if (files[filePath]) {
        setSelectedFile(filePath);
      }
    },
    [files]
  );

  const handleCopy = useCallback(async () => {
    if (!selectedFile || !files[selectedFile]) return;

    try {
      await navigator.clipboard.writeText(files[selectedFile]);
      setCopied(true);
      toast.success("Code copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  }, [selectedFile, files]);

  const filePathParts = selectedFile ? selectedFile.split("/") : [];

  return (
    <div className="h-full w-full flex flex-col bg-background">
      <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
        {/* File Tree Sidebar */}
        <ResizablePanel
          defaultSize={32}
          minSize={24}
          maxSize={42}
          className="flex flex-col min-h-0 border-r border-border/30 bg-muted/10"
        >
          <div className="px-3 py-3 border-b border-border/30 bg-background/50 backdrop-blur-sm">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Files
            </h3>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <TreeView
              data={treeData}
              value={selectedFile}
              onSelect={handleFileSelect}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="w-0.5 bg-border/30 hover:bg-border/50 transition-colors"
        />

        {/* Code Editor */}
        <ResizablePanel defaultSize={68} minSize={58} className="flex flex-col min-h-0 bg-background">
          {selectedFile && files[selectedFile] ? (
            <div className="h-full w-full flex flex-col">
              {/* Header with Breadcrumbs and Copy Button */}
              <div className="flex items-center justify-between gap-4 border-b border-border/30 bg-background/95 backdrop-blur-md px-6 py-3.5 shrink-0">
                <Breadcrumb className="flex-1 min-w-0">
                  <BreadcrumbList className="flex-wrap gap-1.5">
                    {filePathParts.map((part, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && (
                          <BreadcrumbSeparator className="text-muted-foreground/40">
                            <span className="text-xs font-mono">/</span>
                          </BreadcrumbSeparator>
                        )}
                        <BreadcrumbItem>
                          {index === filePathParts.length - 1 ? (
                            <BreadcrumbPage className="text-sm font-semibold text-foreground truncate max-w-[200px] font-mono">
                              {part}
                            </BreadcrumbPage>
                          ) : (
                            <span className="text-sm text-muted-foreground truncate max-w-[150px] hover:text-foreground transition-colors font-mono">
                              {part}
                            </span>
                          )}
                        </BreadcrumbItem>
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 hover:bg-muted/80 transition-colors"
                  onClick={handleCopy}
                  title={copied ? "Copied!" : "Copy code"}
                >
                  {copied ? (
                    <CopyCheckIcon className="size-4 text-primary" />
                  ) : (
                    <CopyIcon className="size-4 text-muted-foreground" />
                  )}
                </Button>
              </div>

              {/* Code View */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <CodeView
                  code={files[selectedFile]}
                  lang={getLanguageExt(selectedFile)}
                />
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted/30 via-muted/20 to-transparent">
              <div className="flex flex-col items-center gap-4 text-center px-6 max-w-md">
                <div className="size-16 rounded-2xl bg-muted/60 border border-border/30 flex items-center justify-center mb-2">
                  <FileIcon className="size-7 text-muted-foreground/60" />
                </div>
                <div className="space-y-2">
                  <p className="text-base font-semibold text-foreground">
                    No file selected
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Select a file from the sidebar to view its contents
                  </p>
                </div>
              </div>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
