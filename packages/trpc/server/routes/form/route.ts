import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { createFormInputModel, createFormOutputModel, listMyFormsInputModel, listMyFormsOutputModel, listFormsInputModel, listFormsOutputModel, getFormByIdInputModel, getFormByIdOutputModel } from "./model";
import { formService } from "../../services/index";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
  getFormById: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getFormById"),
        tags: TAGS,
      },
    })
    .input(getFormByIdInputModel)
    .output(getFormByIdOutputModel)
    .query(async ({ input }) => {
      return await formService.getFormById(input.id);
    }),

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

  listForms: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/listForms"),
        tags: TAGS,
      },
    })
    .input(listFormsInputModel)
    .output(listFormsOutputModel)
    .query(async () => {
      const result = await formService.listForms();
      return result;
    }),
});
