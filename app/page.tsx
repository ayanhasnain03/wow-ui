"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Page = () => {
  const [value, setValue] = useState("");
  const trpc = useTRPC();
  const {data:messages} = useQuery(
    trpc.messages.getMany.queryOptions()
  );
  const createMessageMutation = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        console.log("Invoked");
      },
      onError: ({ data }) => {
        console.log(data);
      },
    })
  );
  return (
    <div className="max-w-7xl min-h-screen flex items-center justify-center flex-col gap-2.5">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button
        className="min-w-md"
        onClick={() => {
          createMessageMutation.mutate({
            value,
          });
        }}
      >
        Create Message
      </Button>
      {JSON.stringify(messages,null,2)}
    </div>
  );
};

export default Page;
