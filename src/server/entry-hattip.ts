// @ts-expect-error viteGlobRoutes plugin
import apiRoutesHattip from "virtual:api-routes/hattip";
import { RequestHandler, compose } from "@hattip/compose";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { TRPC_ENDPOINT } from "../trpc/common";
import { trpcRouter } from "../trpc/router";

export function createHattipEntry() {
  return compose(trpcHanlder(), apiRoutesHattip, indexHtmlHanlder());
}

//
// handle index.html for SPA
//

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

function indexHtmlHanlder(): RequestHandler {
  return async () => {
    // a bit scary but it seems to work because of dead code elination and two step build `vite build && vite build --ssr`
    let html: string;
    if (import.meta.env.DEV) {
      let lib = await import("../../index.html?raw");
      html = lib.default.replace(
        "<!-- INJECT_DEV_VITE_CLIENT -->",
        INJECT_DEV_VITE_CLIENT
      );
    } else {
      const lib = await import("../../dist/client/index.html?raw");
      html = lib.default;
    }
    return new Response(html, {
      headers: [["content-type", "text/html"]],
    });
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
