import { authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { createFormInputModel, createFormOutputModel, listMyFormsInputModel, listMyFormsOutputModel } from "./model";
import { formService } from "../../services/index";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
  createForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createForm"),
        tags: TAGS,
      },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { title, description } = input;
      
      // createdBy is taken from the authenticated user's ID in context
      const { id } = await formService.createForm({
        title,
        description,
        createdBy: ctx.user.id,
      });

      return {
        id,
      };
    }),

  listMyForms: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/listMyForms"),
        tags: TAGS,
      },
    })
    .input(listMyFormsInputModel)
    .output(listMyFormsOutputModel)
    .query(async ({ ctx }) => {
      const result = await formService.listFormByUserId(ctx.user.id);
      return result;
    }),
});
