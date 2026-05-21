import { authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { 
    createFormFieldInputModel, 
    createFormFieldOutputModel, 
    updateFormFieldInputModel, 
    updateFormFieldOutputModel, 
    deleteFormFieldInputModel, 
    deleteFormFieldOutputModel, 
    getFormFieldsInputModel, 
    getFormFieldsOutputModel 
} from "./model";
import { formFieldService } from "../../services/index";

const TAGS = ["Form Field"];
const getPath = generatePath("/form-field");

export const formFieldRouter = router({
    createField: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/createField"),
                tags: TAGS,
            },
        })
        .input(createFormFieldInputModel)
        .output(createFormFieldOutputModel)
        .mutation(async ({ input, ctx }) => {
            const result = await formFieldService.createField(input);
            return {
                id: result!.id
            };
        }),

    updateField: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/updateField"),
                tags: TAGS,
            },
        })
        .input(updateFormFieldInputModel)
        .output(updateFormFieldOutputModel)
        .mutation(async ({ input, ctx }) => {
            const result = await formFieldService.updateField(input);
            return {
                id: result!.id
            };
        }),

    deleteField: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/deleteField"),
                tags: TAGS,
            },
        })
        .input(deleteFormFieldInputModel)
        .output(deleteFormFieldOutputModel)
        .mutation(async ({ input, ctx }) => {
            const result = await formFieldService.deleteField(input);
            return {
                id: result!.id
            };
        }),

    getFields: authenticatedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getFields"),
                tags: TAGS,
            },
        })
        .input(getFormFieldsInputModel)
        .output(getFormFieldsOutputModel)
        .query(async ({ input, ctx }) => {
            const result = await formFieldService.getFields(input);
            return result.map(field => ({
                id: field.id,
                label: field.label,
                labelKey: field.labelKey,
                description: field.description ?? null,
                placeholder: field.placeholder ?? null,
                isRequired: field.isRequired,
                index: field.index,
                type: field.type,
                formId: field.formId ?? null,
                createdAt: field.createdAt ?? null,
                updatedAt: field.updatedAt ?? null,
            }));
        }),
});
