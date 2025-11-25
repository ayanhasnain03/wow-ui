import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "wow-ui-hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    console.log("Step started:", event.data.email);
    await step.sleep("wait-a-moment", "1s");
    console.log("Step finished:", event.data.email);
    return { message: `Hello ${event.data.email}` };
  }
);
