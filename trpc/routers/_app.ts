import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { db } from "@/drizzle/db";
import { z } from "zod";
import { workflow } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(async ({ ctx }) => {
    try {
      return db
        .select()
        .from(workflow)
        .where(eq(workflow.userId, ctx.auth.user.id));
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get workflows",
      });
    }
  }),
  createWorkflow: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await db.insert(workflow).values({
          name: input.name,
          userId: ctx.auth.user.id,
        });
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create workflow",
        });
      }
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
