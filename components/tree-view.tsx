import { TreeItem } from "@/type";
import {
  Files,
  FolderItem,
  FolderTrigger,
  FolderContent,
  FileItem,
} from "@/components/animate-ui/components/radix/files";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

interface TreeViewProps {
  data: TreeItem[];
  value?: string | null;
  onSelect?: (value: string) => void;
}

export const TreeView = ({
  data,
  onSelect,
  value,
}: TreeViewProps) => {
  // Convert TreeItem structure to folder paths for defaultOpen
  const defaultOpenFolders = useMemo(() => {
    const extractFolders = (items: TreeItem[], parentPath = ""): string[] => {
      const folders: string[] = [];
      for (const item of items) {
        if (Array.isArray(item)) {
          const [folderName] = item;
          const folderPath = parentPath ? `${parentPath}/${folderName}` : folderName;
          folders.push(folderPath);
          // Recursively get nested folders
          const [, ...children] = item;
          folders.push(...extractFolders(children, folderPath));
        }
      }
      return folders;
    };
    return extractFolders(data);
  }, [data]);

  const [openFolders, setOpenFolders] = useState<string[]>(defaultOpenFolders);

  return (
    <div className="h-full w-full overflow-hidden bg-background">
      <ScrollArea className="h-full w-full">
        <div className="py-1.5">
          <Files
            open={openFolders}
            onOpenChange={setOpenFolders}
            className={cn(
              "w-full min-w-0",
              "overflow-visible",
              "[&>div]:overflow-visible"
            )}
            style={{
              overflow: "visible",
              position: "relative",
            }}
          >
            {data.map((item, index) => (
              <Tree
                key={index}
                item={item}
                selectValue={value}
                onSelect={onSelect}
                parentPath=""
              />
            ))}
          </Files>
        </div>
      </ScrollArea>
    </div>
  );
};

interface TreeProps {
  item: TreeItem;
  selectValue?: string | null;
  onSelect?: (value: string) => void;
  parentPath: string;
}

const Tree = ({
  item,
  selectValue,
  onSelect,
  parentPath,
}: TreeProps) => {
  // If item is a string, it's a file
  if (typeof item === "string") {
    const currentPath = parentPath ? `${parentPath}/${item}` : item;
    const isSelected = selectValue === currentPath;
    return (
      <div className="relative group">
        {/* Horizontal line for file */}
        {parentPath && (
          <div className="absolute -left-6 top-1/2 w-6 h-[1.5px] bg-border/50" />
        )}
        <FileItem
          onClick={() => onSelect?.(currentPath)}
          className={cn(
            "transition-all duration-200 rounded-md",
            "min-w-0 overflow-hidden",
            isSelected
              ? "text-primary font-semibold  border-primary shadow-sm"
              : "text-foreground/80"
          )}
        >
          <span className="truncate block min-w-0 text-sm">{item}</span>
        </FileItem>
      </div>
    );
  }

  // If item is an array, it's a folder: [folderName, ...children]
  const [folderName, ...children] = item;
  const currentPath = parentPath ? `${parentPath}/${folderName}` : folderName;
  const folderValue = currentPath;

  return (
    <FolderItem value={folderValue} className="min-w-0">
      <FolderTrigger className="[&>div>div>div>span]:truncate [&>div>div>div>span]:block [&>div>div>div>span]:min-w-0 [&>div>div>div>span]:max-w-full">
        {folderName}
      </FolderTrigger>
      <FolderContent className="min-w-0 overflow-visible [&>div]:min-w-0">
        {children.map((child, index) => (
          <Tree
            key={index}
            item={child}
            selectValue={selectValue}
            onSelect={onSelect}
            parentPath={currentPath}
          />
        ))}
      </FolderContent>
    </FolderItem>
  );
};
