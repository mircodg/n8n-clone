import { db } from "@/drizzle/db";
import { workflow } from "@/drizzle/schema";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

export const workflowRouter = createTRPCRouter({
  create: premiumProcedure.mutation(async ({ ctx }) => {
    try {
      const [result] = await db
        .insert(workflow)
        .values({
          name: generateSlug(2, { format: "kebab" }),
          userId: ctx.auth.user.id,
        })
        .returning();
      return result;
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create workflow",
      });
    }
  }),
  getMany: protectedProcedure
    .input(
      z.object({
        limit: z.number().positive().optional().default(10),
        offset: z.number().nonnegative().optional().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await db
          .select()
          .from(workflow)
          .where(eq(workflow.userId, ctx.auth.user.id))
          .offset(input.offset)
          .limit(input.limit ?? 10)
          .orderBy(desc(workflow.createdAt));
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get workflows",
        });
      }
    }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await db
          .select()
          .from(workflow)
          .where(
            and(
              eq(workflow.id, input.id),
              eq(workflow.userId, ctx.auth.user.id)
            )
          );
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get workflow",
        });
      }
    }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await db
          .delete(workflow)
          .where(
            and(
              eq(workflow.id, input.id),
              eq(workflow.userId, ctx.auth.user.id)
            )
          );
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to remove workflow",
        });
      }
    }),
  updateName: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(255),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await db
          .update(workflow)
          .set({ name: input.name })
          .where(
            and(
              eq(workflow.id, input.id),
              eq(workflow.userId, ctx.auth.user.id)
            )
          );
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update workflow name",
        });
      }
    }),
});
