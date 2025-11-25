import { Agent, openai, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";
export const helloWorld = inngest.createFunction(
  { id: "wow-ui-hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    const summerizer = createAgent({
      name: "summarizer",
      system: "You are an expert summarizer. you summrize in 2 words.",
      model: openai({ model: "gpt-3.5-turbo" })
    })
    const { output } = await summerizer.run(
      `Summarize the following text: ${event.data.value}`
    )
    console.log(output)
    return { output }
  }
);
