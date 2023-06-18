import { RequestHandler, compose } from "@hattip/compose";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { TRPC_ENDPOINT } from "../trpc/common";
import { trpcRouter } from "../trpc/router";

export function createHattipEntry() {
  return compose(import.meta.env.DEV && devIndexHtmlHanlder(), trpcHanlder());
}

//
// index.html for dev
//

function devIndexHtmlHanlder(): RequestHandler {
  const INJECT_DEV_VITE_CLIENT = `
<script type="module">
  import RefreshRuntime from "/@react-refresh"
  RefreshRuntime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true
</script>
<script type="module" src="/@vite/client"></script>
`;

  return async (ctx) => {
    if (ctx.url.pathname === "/") {
      const indexHtml = await import("../../index.html?raw");
      const indexHtmlDev = indexHtml.default.replace(
        "<!-- INJECT_DEV_VITE_CLIENT -->",
        INJECT_DEV_VITE_CLIENT
      );
      return new Response(indexHtmlDev, {
        headers: [["content-type", "text/html"]],
      });
    }
    return ctx.next();
  };
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
