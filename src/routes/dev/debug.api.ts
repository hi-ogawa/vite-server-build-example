import { RequestContext } from "@hattip/compose";

export function get(ctx: RequestContext) {
  const data = { ok: true, ctx: { url: { href: ctx.url.href } } };
  return new Response(JSON.stringify(data), {
    headers: [["content-type", "application/json"]],
  });
}
