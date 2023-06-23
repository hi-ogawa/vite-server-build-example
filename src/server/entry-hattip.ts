// @ts-ignore
import documentMiddleware from "virtual:document-middleware/hattip";
import globApiRoutes from "virtual:glob-api-routes/hattip";
import { RequestHandler, compose } from "@hattip/compose";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { TRPC_ENDPOINT } from "../trpc/common";
import { trpcRouter } from "../trpc/router";

export function createHattipEntry() {
  return compose(trpcHanlder(), globApiRoutes(), documentMiddleware());
}

//
// trpc
//

function trpcHanlder(): RequestHandler {
  return (ctx) => {
    if (ctx.url.pathname.startsWith(TRPC_ENDPOINT)) {
      return fetchRequestHandler({
        endpoint: TRPC_ENDPOINT,
        req: ctx.request,
        router: trpcRouter,
        createContext: (ctx) => ctx,
        onError: (e) => {
          console.error(e);
        },
      });
    }
    return ctx.next();
  };
}
