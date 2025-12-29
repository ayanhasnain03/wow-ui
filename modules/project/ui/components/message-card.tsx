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
    <div className="flex justify-end pb-5 pl-12 pr-4">
      <div className="max-w-[85%] rounded-2xl bg-primary text-primary-foreground px-4 py-3 shadow-sm">
        <div className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
          {content}
        </div>
      </div>
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
        "group w-full rounded-xl border px-4 py-3.5 text-left transition-all duration-200",
        "hover:shadow-md hover:scale-[1.01]",
        isActiveFragment
          ? "border-primary/50 bg-primary/5 shadow-sm"
          : "border-border/40 bg-card/50 hover:bg-card hover:border-border/60"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-lg border bg-background shadow-sm transition-colors",
            isActiveFragment
              ? "border-primary/40 bg-primary/5"
              : "border-border/40 group-hover:border-primary/20"
          )}
        >
          {isActiveFragment ? (
            <SparklesIcon className="size-4.5 text-primary" />
          ) : (
            <Code2Icon className="size-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-foreground mb-0.5">
            {fragment.title}
          </div>
          <div className="text-xs text-muted-foreground">
            Click to view preview
          </div>
        </div>

        <ChevronRightIcon className="size-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary shrink-0" />
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
    <div className="relative pb-5 px-4">
      {/* Active indicator */}
      {isActiveFragment && (
        <div className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-primary shadow-sm" />
      )}

      <div className="flex items-center gap-3 py-3">
        <div className={cn(
          "flex size-8 items-center justify-center rounded-lg border bg-background shadow-sm transition-all",
          isActiveFragment && "border-primary/30 shadow-md"
        )}>
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
          <span className="text-xs text-muted-foreground">
            {format(createdAt, "HH:mm · MMM dd, yyyy")}
          </span>
        </div>
      </div>

      <div className={cn("space-y-4", isActiveFragment ? "pl-11" : "pl-10")}>
        <div
          className={cn(
            "whitespace-pre-wrap wrap-break-word text-sm leading-relaxed",
            type === MessageType.ERROR
              ? "text-destructive font-medium"
              : "text-foreground/90"
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
