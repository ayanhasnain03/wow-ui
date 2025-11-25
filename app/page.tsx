import { caller } from "@/trpc/server";



const page = async() => {
  const greeting = await caller.hello({
    text:"Sujo ladli"
  });
  return (
    <div className="text-bold text-rose-500">
      {
        JSON.stringify(greeting)
      }
    </div>
  )
}

export default page
