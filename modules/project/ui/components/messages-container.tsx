
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCard } from "./message-card";
import { Fragment, MessageRole } from "@/lib/generated/prisma/browser";
import { MessageForm } from "./message-form";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageLoading } from "./message-loading";
import { SparklesIcon } from "lucide-react";

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
            hasMessages ? "py-6" : "py-16"
          )}
        >
          {hasMessages ? (
            <div className="flex flex-col">
              {messages.map((message) => {
                const hasFragment = !!message.fragments;
                const isActive =
                  hasFragment &&
                  activeFragment?.id === message.fragments?.id;

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "transition-all duration-300",
                      isActive && "bg-primary/5 rounded-xl mx-2 px-2 py-2"
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
              <div ref={bottomRef} className="h-2" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="size-16 rounded-2xl bg-muted/50 border border-border/30 flex items-center justify-center mb-4">
                <SparklesIcon className="size-8 text-muted-foreground/50" />
              </div>
              <p className="text-base font-medium text-foreground mb-2">
                Start a conversation
              </p>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Ask a question or share what you&apos;d like to work on.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t border-border/30 bg-background/95 backdrop-blur-md shrink-0">
        <div className="p-5">
          <MessageForm projectId={projectId} />
        </div>
      </div>
    </div>
  );
};
