"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const Page = () => {
  const [value, setValue] = useState("");
  const trpc = useTRPC();
  const invokeMutation = useMutation(
    trpc.invoke.mutationOptions({
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
          invokeMutation.mutate({
            value,
          });
        }}
      >
        Invoke
      </Button>
    </div>
  );
};

export default Page;
