import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCard } from "./message-card";
import { Fragment, MessageRole } from "@/lib/generated/prisma/client";
import { MessageForm } from "./message-form";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  projectId: string;
}

export const MessageContainer = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  );
// useEffect(() => {
//  const lastAssistantMessage = messages.findLast((message) => message.role === MessageRole.ASSISTANT);
//   if (lastAssistantMessage) {
//     // TODO SET ACTIVE FRAGMENT TO THE LAST ASSISTANT MESSAGE
//   }
// }, [messages])
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length])
  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full">
      <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
        <div
          className={cn(
            "flex flex-col",
            hasMessages ? "py-4 px-4" : "py-12 px-4"
          )}
        >
          {hasMessages ? (
            <div className="flex flex-col gap-1">
              {messages.map((message) => (
                <MessageCard
                  key={message.id}
                  content={message.content}
                  role={message.role}
                  fragment={
                    message.fragments ??
                    (undefined as unknown as Fragment)
                  }
                  createdAt={message.createdAt}
                  isActiveFragment={false}
                  onFragmentClick={() => {}}
                  type={message.type}
                />
              ))}
              <div ref={bottomRef} /> {/* This is used to scroll to the bottom of the messages container */}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-muted-foreground/60 text-sm max-w-sm">
                Start a conversation by asking a question or sharing what
                you&apos;d like to work on.
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="p-4 pt-3">
          <MessageForm projectId={projectId} />
        </div>
      </div>
    </div>
  );
};
