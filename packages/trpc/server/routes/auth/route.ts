import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createUserWithEmailAndPasswordInputModel,
  createUserWithEmailAndPasswordOutputModel,
  getLoggedInUserInfoInputModel,
  getLoggedInUserInfoOutputModel,
  signInWithEmailAndPasswordInputModel,
  signInWithEmailAndPasswordOutputModel,
} from "./model";
import { userService } from "../../services/index";
import { getAuthenticationCookie, setAuthenticationCookie } from "../../utils/cookie";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({

  createUserWithEmailAndPassword: publicProcedure
    .input(createUserWithEmailAndPasswordInputModel)
    .output(createUserWithEmailAndPasswordOutputModel)
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createUserWithEmailAndPassword"),
        tags: TAGS,
      },
    })
    .mutation(async ({ input, ctx }) => {
      const { fullName, email, password } = input;
      const { id, token} = await userService.createUserWithEmailAndPassword({
        fullName,
        email,
        password,
      });

      setAuthenticationCookie(ctx, token);

      return {
        id,
      };
    }),
  
  signInWithEmailAndPassword: publicProcedure.meta({
    openapi: {
        method: "POST",
        path: getPath("/signInWithEmailAndPassword"),
        tags: TAGS,
      },
  })
  .input(signInWithEmailAndPasswordInputModel)
  .output(signInWithEmailAndPasswordOutputModel)
  .mutation(async ({ input, ctx }) => {
    const { email, password } = input;

    const { id, token} = await userService.signInWithEmailAndPassword({
      email,
      password,
    });

    setAuthenticationCookie(ctx, token);
    return {
      id
    }

  }),

  getLoggedInUserInfo: authenticatedProcedure
  .meta({
    openapi: {
      method: "GET",
      path: getPath("/getLoggedInUserInfo"),
      tags: TAGS,
    },
  })
  .input(getLoggedInUserInfoInputModel)
  .output(getLoggedInUserInfoOutputModel)
  .query(async ({ctx}) => {

    const userInfo = await userService.getUserInfoById(ctx.user.id);
    if (!userInfo) {
      throw new Error('invalid user token');
    }
    const { id, email, fullName, profilePictureUrl } = userInfo;
    if (!id || !email || !fullName) {
      throw new Error('invalid user token');
    }

    return {
      id,
      email,
      fullName,
      profilePictureUrl: profilePictureUrl ?? undefined,
    };

  }),

});
