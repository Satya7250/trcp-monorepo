import { httpBatchLink, httpLink } from "@repo/trpc/client";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const link = opts?.enableStreaming ? httpLink : httpBatchLink;
  
  return link({
    url: env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/trpc",
    fetch(url, options) {
      return fetch(url, {
        ...options,
        credentials: "include", // Include cookies in requests
      });
    },
  });
};