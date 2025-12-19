import { inngest } from "@/inngest/client"
import { prisma } from "@/lib/db"
import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { MessageRole, MessageType } from "@/lib/generated/prisma/enums"
import z from "zod"

export const messageRouter = createTRPCRouter({
    getMany: baseProcedure.query(async ()=>{
        const messages = await prisma.message.findMany({
            orderBy:{
                updatedAt:"desc"
            }
        })
        return messages;
    }),
    create: baseProcedure.input(
        z.object({
            value: z.string().min(1, { message: "Value is required" }),
        })
    ).mutation(async ({
        input,
    }) => {
        try {
            console.log("Creating message", input.value);
            const createdMessage = await prisma.message.create({
                data: {
                    content: input.value,
                    role: MessageRole.USER,
                    type: MessageType.RESULT,
                }
            })
            console.log("Message created", createdMessage);
            await inngest.send({
                name: "code-agent/run",
                data: {
                    value: input.value
                }
            })
            return createdMessage;
        } catch (error) {
            console.error("Error creating message:", error);
            throw error;
        }
    })
})
