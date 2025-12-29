import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Kbd } from "@/components/ui/kbd";
import { Loader2, SendIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props {
  projectId?: string;
}

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Value is required" })
    .max(1000, { message: "Value is too long" }),
});

export const MessageForm = ({
  projectId
}: Props) => {
  const trpc = useTRPC();
const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });
const createMessage = useMutation(
  trpc.messages.create.mutationOptions({
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries(trpc.messages.getMany.queryOptions({ projectId: projectId ?? "" }));
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
      form.setError("value", { message: error.message });
      form.setFocus("value");
    },
  })
  );
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await createMessage.mutateAsync({
      value: data.value,
      projectId: projectId ?? "",
    });
    form.reset();
  };
const [isFocused, setIsFocused] = useState(false);
const isPending = createMessage.isPending;
const isDisabled = isPending || !form.formState.isValid;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative rounded-2xl border transition-all duration-300",
          "bg-card/50 backdrop-blur-sm",
          isFocused
            ? "border-primary/40 shadow-lg shadow-primary/5 ring-1 ring-primary/10"
            : "border-border/40 shadow-sm hover:border-border/60"
        )}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => {
            const isEmpty = !field.value || field.value.trim().length === 0;
            return (
              <FormItem>
                <FormControl>
                  <div className="flex items-end gap-3 px-5 py-4">
                    <TextareaAutosize
                      {...field}
                      disabled={isPending}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      minRows={1}
                      maxRows={6}
                      placeholder="Ask a question or start a conversation..."
                      className={cn(
                        "flex-1 resize-none border-0 bg-transparent text-foreground",
                        "placeholder:text-muted-foreground/50",
                        "focus:ring-0 focus-visible:outline-none",
                        "text-sm leading-relaxed",
                        "scrollbar-thin scrollbar-thumb-border/30 scrollbar-track-transparent"
                      )}
                    />
                    <div className="flex items-center gap-2.5 pb-1">
                      {!isFocused && !isEmpty && (
                        <div className="hidden text-[10px] text-muted-foreground/40 sm:flex items-center gap-1">
                          <Kbd className="text-[10px] px-1.5 py-0.5 bg-muted/60 border-border/40">
                            ⌘
                          </Kbd>
                          <span className="text-[10px]">+</span>
                          <Kbd className="text-[10px] px-1.5 py-0.5 bg-muted/60 border-border/40">
                            ↵
                          </Kbd>
                        </div>
                      )}
                      <Button
                        type="submit"
                        size="icon"
                        disabled={isEmpty || isDisabled}
                        className={cn(
                          "h-9 w-9 shrink-0 rounded-xl transition-all duration-200",
                          "shadow-sm",
                          isEmpty
                            ? "opacity-50 cursor-not-allowed"
                            : "opacity-100 hover:scale-105 active:scale-95 hover:shadow-md"
                        )}
                      >
                        {
                          isPending ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <SendIcon className="size-4" />
                          )
                        }
                      </Button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="px-5 pb-3 text-xs" />
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
};
