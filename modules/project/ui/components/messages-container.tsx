
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCard } from "./message-card";
import { Fragment, MessageRole } from "@/lib/generated/prisma/browser";
import { MessageForm } from "./message-form";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageLoading } from "./message-loading";

interface Props {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
}

export const MessageContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
}: Props) => {
  const trpc = useTRPC();
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastFragmentIdRef = useRef<string | null>(null);

  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({ projectId },{
      refetchInterval:5000
    })
  );

  const hasMessages = messages.length > 0;
  useEffect(() => {
    if (!hasMessages) return;

    const lastAssistantMessage = messages.findLast(
      (message) => message.role === MessageRole.ASSISTANT
    );

    if (!lastAssistantMessage?.fragments) return;

    if (lastFragmentIdRef.current !== lastAssistantMessage.fragments.id) {
      setActiveFragment(lastAssistantMessage.fragments);
      lastFragmentIdRef.current = lastAssistantMessage.fragments.id;
    }
  }, [messages, setActiveFragment]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages.length]);

  const lastMessage = messages[messages.length - 1];
  const isLastMessageUser = lastMessage?.role === MessageRole.USER;

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full">
      <ScrollArea className="flex-1 min-h-0">
        <div
          className={cn(
            "flex flex-col",
            hasMessages ? "py-4 px-4" : "py-12 px-4"
          )}
        >
          {hasMessages ? (
            <div className="flex flex-col gap-1">
              {messages.map((message) => {
                const hasFragment = !!message.fragments;
                const isActive =
                  hasFragment &&
                  activeFragment?.id === message.fragments?.id;

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "transition-all duration-200",
                      isActive && "ring-1 ring-primary/20 rounded-lg -mx-1 px-1 bg-primary/5"
                    )}
                  >
                    <MessageCard
                      content={message.content}
                      role={message.role}
                      fragment={
                        message.fragments ??
                        (undefined as unknown as Fragment)
                      }
                      createdAt={message.createdAt}
                      isActiveFragment={isActive}
                      onFragmentClick={() => {
                        if (message.fragments) {
                          setActiveFragment(message.fragments);
                        }
                      }}
                      type={message.type}
                    />
                  </div>
                );
              })}
              {
                isLastMessageUser && (
               <MessageLoading/>
                )
              }
              <div ref={bottomRef} className="h-1" />
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
      <div className="border-t border-border/50 bg-background/80 backdrop-blur-sm shrink-0">
        <div className="p-4 pt-3">
          <MessageForm projectId={projectId} />
        </div>
      </div>
    </div>
  );
};
