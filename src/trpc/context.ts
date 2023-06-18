import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export type TrpcAppContext = Awaited<ReturnType<typeof createTrpcAppContext>>;

export const createTrpcAppContext = async (
  options: FetchCreateContextFnOptions
) => {
  return options;
};
