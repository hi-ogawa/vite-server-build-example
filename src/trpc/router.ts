import { trpcProcedureBuilder, trpcRouterFactory } from "./factory";

export const trpcRouter = trpcRouterFactory({
  _debug: trpcProcedureBuilder.query(() => {
    return {
      ok: true,
    };
  }),
});
