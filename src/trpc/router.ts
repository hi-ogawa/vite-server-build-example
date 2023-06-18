import { trpcProcedureBuilder, trpcRouterFactory } from "./factory";

export const trpcRouter = trpcRouterFactory({
  debug: trpcProcedureBuilder.query(({ ctx }) => {
    const headers: [string, string][] = [];
    ctx.req.headers.forEach((v, k) => headers.push([k, v]));

    return {
      env: process.env,
      headers,
    };
  }),
});
