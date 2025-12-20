import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Fragment } from "@/lib/generated/prisma/client";
import { MessageRole, MessageType } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import Image from "next/image";
interface UserMessageProps {
  content: string;
}
const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <div className="flex justify-end pb-4 pr-2 pl-10">
      <Card className="rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] wrap-break-word">
        {content}
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
      className={cn(
        "flex items-start gap-2 border rounded-lg bg-muted p-2.5 shadow-none border-none w-fit",
        isActiveFragment && "bg-primary/10 border-primary/20"
      )}
      onClick={() => {
        onFragmentClick(fragment);
      }}
    >
      <Code2Icon className="size-4 shrink-0 text-muted-foreground" />
      <div className="flex flex-col flex-1">
        <span className="text-sm font-medium line-clamp-1 text-foreground">
          {fragment.title}
        </span>
        <span className="text-xs text-muted-foreground">Preview</span>
      </div>
      <div className="flex items-center justify-center">
        <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
      </div>
    </button>
  );
};
interface AssistantMessageProps {
  content: string;
  fragment: Fragment;
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
    <div
      className={cn(
        "flex flex-col group px-2 pb-4",
        type === MessageType.ERROR && "text-red-700 dark:text-red-500"
      )}
    >
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src="/logo.svg"
          alt="VIBE"
          width={18}
          height={18}
          className="shrink-0"
        />
        <span className="text-sm font-medium">VIBE</span>
        <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
        </span>
      </div>
      <div className="pl-8.5 flex flex-col gap-y-4">
        <span>{content}</span>
        {fragment && type === "RESULT" && (
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
  fragment: Fragment;
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
};
