import { db } from "@/drizzle/db";
import { workflow } from "@/drizzle/schema";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { z } from "zod";
import { pagination } from "@/config/constants";

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
        page: z.number().default(pagination.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(pagination.MIN_PAGE_SIZE)
          .max(pagination.MAX_PAGE_SIZE)
          .default(pagination.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const [items, totalCount] = await Promise.all([
          db
            .select()
            .from(workflow)
            .where(
              and(
                eq(workflow.userId, ctx.auth.user.id),
                ilike(workflow.name, `%${input.search}%`)
              )
            )
            .offset((input.page - 1) * input.pageSize)
            .limit(input.pageSize)
            .orderBy(desc(workflow.updatedAt)),
          db
            .select({ count: sql<number>`count(*)` })
            .from(workflow)
            .where(
              and(
                eq(workflow.userId, ctx.auth.user.id),
                ilike(workflow.name, `%${input.search}%`)
              )
            ),
        ]);

        const totalPages = Math.ceil(totalCount[0].count / input.pageSize);

        const hasNextPage = input.page < totalPages;
        const hasPreviousPage = input.page > 1;

        return {
          items,
          page: input.page,
          pageSize: input.pageSize,
          totalCount: totalCount[0].count,
          totalPages,
          hasNextPage,
          hasPreviousPage,
        };
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
        const [result] = await db
          .delete(workflow)
          .where(
            and(
              eq(workflow.id, input.id),
              eq(workflow.userId, ctx.auth.user.id)
            )
          )
          .returning();
        return result;
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
