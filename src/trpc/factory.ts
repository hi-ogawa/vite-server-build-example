import { initTRPC } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

const t = initTRPC.context<FetchCreateContextFnOptions>().create();

export const trpcRouterFactory = t.router;
export const trpcMiddlewareFactory = t.middleware;
export const trpcProcedureBuilder = t.procedure;
