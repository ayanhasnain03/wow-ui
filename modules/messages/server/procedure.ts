import { inngest } from "@/inngest/client"
import { prisma } from "@/lib/db"
import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { MessageRole, MessageType } from "@/lib/generated/prisma/enums"
import z from "zod"

export const messageRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(z.object({
            projectId: z.string().min(1, { message: "Project ID is required" }),
        }))
        .query(async ({ input }) => {
            const messages = await prisma.message.findMany({
                where: {
                    projectId: input.projectId,
                },
                orderBy: {
                    updatedAt: "asc"
                },
                include: {
                    fragments: true,
                },
            })
            return messages;
        }),
    create: baseProcedure.input(
        z.object({
            value: z.string().min(1, { message: "Value is required" }).max(1000, { message: "Value is too long" }),
            projectId: z.string().min(1, { message: "Project ID is required" }),
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
                    projectId: input.projectId,
                }
            })
            console.log("Message created", createdMessage);
            await inngest.send({
                name: "code-agent/run",
                data: {
                    value: input.value,
                    projectId: input.projectId,
                }
            })
            return createdMessage;
        } catch (error) {
            console.error("Error creating message:", error);
            throw error;
        }
    })
})
