import { httpLink } from "@repo/trpc/client";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  return httpLink({
    url: env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/trpc",
  });
};
