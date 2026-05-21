import { TRPCError, initTRPC } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";
import { userService } from './services'

import { createContext } from "./context";
import { getAuthenticationCookie } from "./utils/cookie";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;


export const authenticatedProcedure = publicProcedure.use(async options => {
  const { ctx } = options
  const userToken = getAuthenticationCookie(ctx)
  
  if (!userToken) {
    console.log('[AuthMiddleware] No token found in cookies. Available cookies:', ctx.req.cookies);
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not logged in",
    });
  }

  try {
    const { id } = await userService.verifyAndDecodeUserToken(userToken);

    return options.next({
      ctx: {
        ...ctx,
        user: {
          id,
        }
      }
    })
  } catch (error: any) {
    console.error('[AuthMiddleware] JWT Verification failed:', error.message);
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or expired session",
    });
  }
})
