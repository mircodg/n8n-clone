import { TRPCError } from "@trpc/server";
import type { Edge, Node } from "@xyflow/react";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { generateSlug } from "random-word-slugs";
import { z } from "zod";
import { pagination } from "@/config/constants";
import { db } from "@/drizzle/db";
import { connection, NodeType, node, workflow } from "@/drizzle/schema";
import {
	createTRPCRouter,
	premiumProcedure,
	protectedProcedure,
} from "@/trpc/init";

export const workflowRouter = createTRPCRouter({
	create: premiumProcedure.mutation(async ({ ctx }) => {
		try {
			const [workflowResult] = await db
				.insert(workflow)
				.values({
					name: generateSlug(2, { format: "kebab" }),
					userId: ctx.auth.user.id,
				})
				.returning();

			await db.insert(node).values({
				name: NodeType.INITIAL,
				type: NodeType.INITIAL,
				position: { x: 0, y: 0 },
				workflowId: workflowResult.id,
			});

			return workflowResult;
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
			}),
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
								ilike(workflow.name, `%${input.search}%`),
							),
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
								ilike(workflow.name, `%${input.search}%`),
							),
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
			}),
		)
		.query(async ({ ctx, input }) => {
			try {
				const [result] = await db
					.select()
					.from(workflow)
					.where(
						and(
							eq(workflow.id, input.id),
							eq(workflow.userId, ctx.auth.user.id),
						),
					);

				if (!result) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Workflow not found",
					});
				}

				// Get all nodes for this workflow
				const dbNodes = await db
					.select()
					.from(node)
					.where(eq(node.workflowId, result.id));

				// Transform server nodes to react-flow nodes
				const nodes: Node[] = dbNodes.map((node) => ({
					id: node.id,
					type: node.type,
					position: node.position as { x: number; y: number },
					data: (node.data as Record<string, unknown>) || {},
				}));

				// Get all connections for this workflow
				const dbConnections = await db
					.select()
					.from(connection)
					.where(eq(connection.workflowId, result.id));

				// Transform server connections to react-flow edges
				const edges: Edge[] = dbConnections.map((connection) => ({
					id: connection.id,
					source: connection.fromNodeId,
					target: connection.toNodeId,
					sourceHandle: connection.fromOutput,
					targetHandle: connection.toInput,
				}));

				return {
					...result,
					nodes,
					edges,
				};
			} catch (error) {
				if (error instanceof TRPCError) {
					throw error;
				}
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
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const [result] = await db
					.delete(workflow)
					.where(
						and(
							eq(workflow.id, input.id),
							eq(workflow.userId, ctx.auth.user.id),
						),
					)
					.returning();

				if (!result) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Workflow not found",
					});
				}

				return result;
			} catch {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to remove workflow",
				});
			}
		}),
	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				nodes: z.array(
					z.object({
						id: z.string(),
						type: z.string().nullish(),
						position: z.object({ x: z.number(), y: z.number() }),
						data: z.record(z.string(), z.any()).optional(),
					}),
				),
				edges: z.array(
					z.object({
						source: z.string(),
						target: z.string(),
						sourceHandle: z.string().nullish(),
						targetHandle: z.string().nullish(),
					}),
				),
			}),
		)
		.mutation(async ({ input }) => {
			const { id, nodes, edges } = input;

			await db.select().from(workflow).where(eq(workflow.id, id));

			// delete all nodes and connections for this workflow
			await db.delete(connection).where(eq(connection.workflowId, id));
			await db.delete(node).where(eq(node.workflowId, id));

			// insert new nodes with their original IDs
			if (nodes.length > 0) {
				await db.insert(node).values(
					nodes.map((n) => ({
						id: n.id,
						name: n.type || "unknown",
						type: n.type as (typeof NodeType)[keyof typeof NodeType],
						position: n.position,
						data: n.data || {},
						workflowId: id,
					})),
				);
			}

			// create connections
			if (edges.length > 0) {
				await db.insert(connection).values(
					edges.map((edge) => ({
						workflowId: id,
						fromNodeId: edge.source,
						toNodeId: edge.target,
						fromOutput: edge.sourceHandle || "main",
						toInput: edge.targetHandle || "main",
					})),
				);
			}

			// update workflow updatedAt
			const [result] = await db
				.update(workflow)
				.set({ updatedAt: new Date() })
				.where(eq(workflow.id, id))
				.returning();

			return result;
		}),
	updateName: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().min(1).max(255),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const [result] = await db
					.update(workflow)
					.set({ name: input.name })
					.where(
						and(
							eq(workflow.id, input.id),
							eq(workflow.userId, ctx.auth.user.id),
						),
					)
					.returning();

				if (!result) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Workflow not found",
					});
				}

				return result;
			} catch {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update workflow name",
				});
			}
		}),
});
