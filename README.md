# vite server build example

Simple demo to use Vite for building both client and server.
Note that this is not to demonstrate "server side rendering".

## summary

- React client
- tRPC server
- [@vavite/connect](https://github.com/cyco130/vavite/tree/main/packages/connect) to integrate server to vite dev/build
- simple scripts (see [`misc/vercel`](./misc/vercel)) to put them together as [Build Output API](https://vercel.com/docs/build-output-api/v3/primitives#edge-functions) for Vercel static/edge deployment

## usage

```sh
# development
pnpm i
pnpm dev

# release
pnpm build
pnpm release-production
```
