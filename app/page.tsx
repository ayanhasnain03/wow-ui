"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const trpc = useTRPC();
  const {data:projects} = useQuery(
    trpc.projects.getMany.queryOptions()
  );
  const createProjectMutation = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
      toast.success(`Project created successfully: ${data?.name}`);
      router.push(`/projects/${data?.id}`);
      },
      onError: ({ data }) => {
        console.log(data);
        toast.error(data?.code ?? "Something went wrong");
      },
    })
  );
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto flex items-center flex-col gap-y-4 justify-center">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button onClick={() => createProjectMutation.mutate({ value })}>Create Project</Button>
      </div>
    </div>
  );
};
export default Page;
