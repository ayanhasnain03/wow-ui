import { inngest } from "@/inngest/client"
import { prisma } from "@/lib/db"
import { protectedProcedure, createTRPCRouter } from "@/trpc/init"
import { MessageRole, MessageType } from "@/lib/generated/prisma/enums"
import z from "zod"
import { TRPCError } from "@trpc/server"

export const messageRouter = createTRPCRouter({
    getMany: protectedProcedure
        .input(z.object({
            projectId: z.string().min(1, { message: "Project ID is required" }),
        }))
        .query(async ({ input, ctx }) => {

            const messages = await prisma.message.findMany({
                where: {
                    projectId: input.projectId,
                    project: {
                        userId: ctx.auth.userId,
                    },
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
    create: protectedProcedure.input(
        z.object({
            value: z.string().min(1, { message: "Value is required" }).max(1000, { message: "Value is too long" }),
            projectId: z.string().min(1, { message: "Project ID is required" }),
        })
    ).mutation(async ({
        input,
        ctx,
    }) => {
        const existingProject = await prisma.project.findUnique({
            where: {
                id: input.projectId,
                userId: ctx.auth.userId,
            },
        });
        if (!existingProject) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
        }
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
