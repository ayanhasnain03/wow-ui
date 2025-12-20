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
          "relative rounded-2xl border transition-all duration-200",
          "bg-background/50 backdrop-blur-sm",
          isFocused
            ? "border-border shadow-lg shadow-primary/5"
            : "border-border/50 shadow-sm"
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
                  <div className="flex items-end gap-3 px-4 py-3">
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
                        "placeholder:text-muted-foreground/60",
                        "focus:ring-0 focus-visible:outline-none",
                        "text-sm leading-relaxed",
                        "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
                      )}
                    />
                    <div className="flex items-center gap-2 pb-0.5">
                      {!isFocused && (
                        <div className="hidden text-[10px] text-muted-foreground/50 sm:block">
                          <Kbd className="text-[10px] px-1.5 py-0.5">
                            ⌘↵
                          </Kbd>
                        </div>
                      )}
                      <Button
                        type="submit"
                        size="icon-sm"
                        disabled={isEmpty || isDisabled}
                        className={cn(
                          "h-7 w-7 shrink-0 rounded-full transition-all",
                          isEmpty
                            ? "opacity-40"
                            : "opacity-100 hover:scale-105 active:scale-95"
                        )}
                      >
                        {
                          isPending ? <Loader2 className="size-4 animate-spin" /> : <SendIcon className="size-4" />
                        }
                      </Button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="px-4 pb-2" />
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
};
