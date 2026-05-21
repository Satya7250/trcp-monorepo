import { z } from 'zod';
import { 
    createFormFieldInput, 
    updateFormFieldInput, 
    deleteFormFieldInput, 
    getFormFieldsInput,
    fieldTypeEnum
} from "@repo/services/form-field";

export const createFormFieldInputModel = createFormFieldInput;

export const createFormFieldOutputModel = z.object({
    id: z.string().uuid().describe('The ID of the created field'),
});

export const updateFormFieldInputModel = updateFormFieldInput;

export const updateFormFieldOutputModel = z.object({
    id: z.string().uuid().describe('The ID of the updated field'),
});

export const deleteFormFieldInputModel = deleteFormFieldInput;

export const deleteFormFieldOutputModel = z.object({
    id: z.string().uuid().describe('The ID of the deleted field'),
});

export const getFormFieldsInputModel = getFormFieldsInput;

export const getFormFieldsOutputModel = z.array(z.object({
    id: z.string().uuid().describe('The ID of the field'),
    label: z.string().describe('The display label for the field'),
    labelKey: z.string().describe('The slug version of the label'),
    description: z.string().nullable().describe('An optional description for the field'),
    placeholder: z.string().nullable().describe('An optional placeholder for the field'),
    isRequired: z.boolean().describe('Whether the field is required'),
    index: z.string().describe('Fractional index for sorting'),
    type: fieldTypeEnum.describe('The type of the field'),
    formId: z.string().uuid().nullable().describe('The ID of the form this field belongs to'),
    createdAt: z.date().nullable().describe('The date the field was created'),
    updatedAt: z.date().nullable().describe('The date the field was last updated'),
}));
