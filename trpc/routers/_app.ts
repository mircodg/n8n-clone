import { createTRPCRouter } from "@/trpc/init";
import { workflowRouter } from "@/app/_workflows/server/routers";

export const appRouter = createTRPCRouter({
	workflows: workflowRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
