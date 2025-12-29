import * as React from 'react';
import { FolderIcon, FolderOpenIcon, FileIcon, ChevronRight } from 'lucide-react';

import {
  Files as FilesPrimitive,
  FilesHighlight as FilesHighlightPrimitive,
  FolderItem as FolderItemPrimitive,
  FolderHeader as FolderHeaderPrimitive,
  FolderTrigger as FolderTriggerPrimitive,
  FolderHighlight as FolderHighlightPrimitive,
  Folder as FolderPrimitive,
  FolderIcon as FolderIconPrimitive,
  FileLabel as FileLabelPrimitive,
  FolderContent as FolderContentPrimitive,
  FileHighlight as FileHighlightPrimitive,
  File as FilePrimitive,
  FileIcon as FileIconPrimitive,
  useFolder,
  type FilesProps as FilesPrimitiveProps,
  type FolderItemProps as FolderItemPrimitiveProps,
  type FolderContentProps as FolderContentPrimitiveProps,
  type FileProps as FilePrimitiveProps,
  type FileLabelProps as FileLabelPrimitiveProps,
} from '@/components/animate-ui/primitives/radix/files';
import { cn } from '@/lib/utils';

type GitStatus = 'untracked' | 'modified' | 'deleted';

type FilesProps = FilesPrimitiveProps;

function Files({ className, children, ...props }: FilesProps) {
  return (
    <FilesPrimitive className={cn('p-1 w-full', className)} {...props}>
      <FilesHighlightPrimitive className="bg-primary/10 rounded-lg pointer-events-none transition-colors duration-200 border border-primary/20">
        {children}
      </FilesHighlightPrimitive>
    </FilesPrimitive>
  );
}

type SubFilesProps = FilesProps;

function SubFiles(props: SubFilesProps) {
  return <FilesPrimitive {...props} />;
}

type FolderItemProps = FolderItemPrimitiveProps;

function FolderItem(props: FolderItemProps) {
  return <FolderItemPrimitive {...props} />;
}

type FolderTriggerProps = FileLabelPrimitiveProps & {
  gitStatus?: GitStatus;
};

function FolderTrigger({
  children,
  className,
  gitStatus,
  ...props
}: FolderTriggerProps) {
  const { isOpen } = useFolder();

  return (
    <FolderHeaderPrimitive>
      <FolderTriggerPrimitive className="w-full text-start">
        <FolderHighlightPrimitive>
          <FolderPrimitive className="flex items-center justify-between gap-2 px-2 py-1.5 pointer-events-none rounded-md hover:bg-muted/50 transition-colors group">
            <div
              className={cn(
                'flex items-center gap-2 flex-1 min-w-0',
                gitStatus === 'untracked' && 'text-green-400',
                gitStatus === 'modified' && 'text-amber-400',
                gitStatus === 'deleted' && 'text-red-400',
              )}
            >
              <ChevronRight
                className={cn(
                  'size-3.5 text-muted-foreground transition-transform duration-200 shrink-0',
                  isOpen && 'rotate-90'
                )}
              />
              <FolderIconPrimitive
                closeIcon={<FolderIcon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />}
                openIcon={<FolderOpenIcon className="size-4 text-primary" />}
              />
              <FileLabelPrimitive
                className={cn('text-sm font-medium text-foreground/90 truncate', className)}
                {...props}
              >
                {children}
              </FileLabelPrimitive>
            </div>

            {gitStatus && (
              <span
                className={cn(
                  'rounded-full size-2 shrink-0',
                  gitStatus === 'untracked' && 'bg-green-400',
                  gitStatus === 'modified' && 'bg-amber-400',
                  gitStatus === 'deleted' && 'bg-red-400',
                )}
              />
            )}
          </FolderPrimitive>
        </FolderHighlightPrimitive>
      </FolderTriggerPrimitive>
    </FolderHeaderPrimitive>
  );
}

type FolderContentProps = FolderContentPrimitiveProps;

function FolderContent(props: FolderContentProps) {
  return (
    <div className="relative ml-6 pl-3">
      {/* Vertical line */}
      <div className="absolute -left-px top-0 bottom-0 w-[1.5px] bg-border/50" />
      {/* Horizontal connector line */}
      <div className="absolute -left-6 top-0 w-6 h-[1.5px] bg-border/50" />
      <FolderContentPrimitive {...props} />
    </div>
  );
}

type FileItemProps = FilePrimitiveProps & {
  icon?: React.ElementType;
  gitStatus?: GitStatus;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

function FileItem({
  icon: Icon = FileIcon,
  className,
  children,
  gitStatus,
  onClick,
  ...props
}: FileItemProps) {
  return (
    <FileHighlightPrimitive className="cursor-pointer">
      <FilePrimitive
        onClick={onClick}
        className={cn(
          'flex items-center justify-between gap-2 px-2 py-1.5 rounded-md transition-colors group',
          'hover:bg-muted/60',
          gitStatus === 'untracked' && 'text-green-400',
          gitStatus === 'modified' && 'text-amber-400',
          gitStatus === 'deleted' && 'text-red-400',
        )}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-3.5 shrink-0" /> {/* Spacer for alignment with folders */}
          <FileIconPrimitive>
            <Icon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </FileIconPrimitive>
          <FileLabelPrimitive className={cn('text-sm text-foreground/80 truncate', className)} {...props}>
            {children}
          </FileLabelPrimitive>
        </div>

        {gitStatus && (
          <span className="text-sm font-medium shrink-0">
            {gitStatus === 'untracked' && 'U'}
            {gitStatus === 'modified' && 'M'}
            {gitStatus === 'deleted' && 'D'}
          </span>
        )}
      </FilePrimitive>
    </FileHighlightPrimitive>
  );
}

export {
  Files,
  FolderItem,
  FolderTrigger,
  FolderContent,
  FileItem,
  SubFiles,
  type FilesProps,
  type FolderItemProps,
  type FolderTriggerProps,
  type FolderContentProps,
  type FileItemProps,
  type SubFilesProps,
};
