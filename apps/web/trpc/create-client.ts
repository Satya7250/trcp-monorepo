import { httpBatchLink, httpLink } from "@repo/trpc/client";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  // Use httpLink instead of httpBatchLink for better reliability with cookies in dev
  const link = httpLink;
  
  return link({
    url: env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/trpc",
    fetch(url, options) {
      return fetch(url, {
        ...options,
        credentials: "include",
      });
    },
  });
};