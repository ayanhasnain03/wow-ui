"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

const page =  () => {
  const trpc = useTRPC()
  const invokeMutation = useMutation(trpc.invoke.mutationOptions({
    onSuccess:()=>{
      console.log("Invoked")
    },
    onError:({data})=>{
      console.log(data)
    }
  }))
  return <div className="max-w-7xl min-h-screen flex items-center justify-center">
    <Button className="min-w-md" onClick={()=>{
      invokeMutation.mutate({
        text:"Invoked Success from my side"
      })
    }}>
      Invoke
    </Button>
  </div>;
};

export default page;
