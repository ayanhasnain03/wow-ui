import { Card } from "@/components/ui/card";
import { Fragment } from "@/lib/generated/prisma/browser";
import { MessageRole, MessageType } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronRightIcon, Code2Icon, SparklesIcon } from "lucide-react";
import Image from "next/image";

interface UserMessageProps {
  content: string;
}

const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <div className="flex justify-end pb-4 pl-10 pr-2">
      <Card className="max-w-[80%] border bg-muted/60 px-3 py-2 text-sm shadow-none">
        <div className="whitespace-pre-wrap break-words leading-relaxed">
          {content}
        </div>
      </Card>
    </div>
  );
};

interface FragmentCardProps {
  fragment: Fragment;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}

const FragmentCard = ({
  fragment,
  isActiveFragment,
  onFragmentClick,
}: FragmentCardProps) => {
  return (
    <button
      type="button"
      onClick={() => onFragmentClick(fragment)}
      className={cn(
        "group w-full rounded-lg border px-3 py-2 text-left transition",
        "hover:bg-muted/60",
        isActiveFragment
          ? "border-primary/40 bg-primary/5"
          : "border-border/60 bg-muted/30"
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex size-7 items-center justify-center rounded-md border bg-background",
            isActiveFragment ? "border-primary/30" : "border-border/60"
          )}
        >
          {isActiveFragment ? (
            <SparklesIcon className="size-4 text-primary" />
          ) : (
            <Code2Icon className="size-4 text-muted-foreground" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{fragment.title}</div>
          <div className="text-xs text-muted-foreground">
            Click to open preview
          </div>
        </div>

        <ChevronRightIcon className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
    </button>
  );
};

interface AssistantMessageProps {
  content: string;
  fragment?: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: MessageType;
}

const AssistantMessage = ({
  content,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: AssistantMessageProps) => {
  return (
    <div className="relative pb-4 px-2">
      {/* active indicator (minimal) */}
      {isActiveFragment && (
        <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-primary" />
      )}

      <div
        className={cn(
          "flex items-center gap-2 py-3",
          isActiveFragment ? "pl-3" : "pl-2"
        )}
      >
        <div className="flex size-7 items-center justify-center rounded-md border bg-background">
          <Image
            src="/logo.svg"
            alt="VIBE"
            width={16}
            height={16}
            className="shrink-0"
          />
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-primary">VIBE</span>
          <span className="text-xs text-muted-foreground">
            {format(createdAt, "HH:mm · MMM dd, yyyy")}
          </span>
        </div>
      </div>

      <div className={cn("space-y-3", isActiveFragment ? "pl-10" : "pl-9")}>
        <div
          className={cn(
            "whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90",
            type === MessageType.ERROR && "text-red-600 dark:text-red-500"
          )}
        >
          {content}
        </div>

        {fragment && type === MessageType.RESULT && (
          <FragmentCard
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
          />
        )}
      </div>
    </div>
  );
};

interface MessageCardProps {
  content: string;
  role: MessageRole;
  fragment?: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: MessageType;
}

export const MessageCard = ({
  content,
  role,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: MessageCardProps) => {
  if (role === MessageRole.ASSISTANT) {
    return (
      <AssistantMessage
        content={content}
        fragment={fragment}
        createdAt={createdAt}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
        type={type}
      />
    );
  }

  if (role === MessageRole.USER) {
    return <UserMessage content={content} />;
  }

  return null;
};
