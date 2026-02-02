import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import * as schema from "@/drizzle/schema";

import { polar, checkout, portal } from "@polar-sh/better-auth";
import polarClient from "@/lib/polar";

if (!process.env.POLAR_SUCCESS_URL) {
	throw new Error("POLAR_SUCCESS_URL is not set");
}

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		schema,
		provider: "pg",
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
	},
	plugins: [
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			use: [
				checkout({
					products: [
						{
							productId: "e2a5ece4-4c9f-4c04-a663-fcc0aa48da59",
							slug: "Flowie-Pro",
						},
					],
					successUrl: process.env.POLAR_SUCCESS_URL,
					authenticatedUsersOnly: true,
				}),
				portal({}),
			],
		}),
	],
});
