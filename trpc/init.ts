import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";
import polarClient from "@/lib/polar";

export const createTRPCContext = cache(async () => {
	/**
	 * @see: https://trpc.io/docs/server/context
	 */
	return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
	/**
	 * @see https://trpc.io/docs/server/data-transformers
	 */
	transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ next, ctx }) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session) {
		throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
	}
	return next({
		ctx: {
			...ctx,
			auth: session,
		},
	});
});

export const premiumProcedure = protectedProcedure.use(
	async ({ next, ctx }) => {
		let customer;
		try {
			customer = await polarClient.customers.getStateExternal({
				externalId: ctx.auth.user.id,
			});
		} catch {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to get customer state",
			});
		}

		if (!customer || customer.activeSubscriptions.length === 0) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message:
					"An active premium subscription is required to access this feature",
			});
		}

		return next({
			ctx: {
				...ctx,
				customer,
			},
		});
	},
);
