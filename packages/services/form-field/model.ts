import { z } from 'zod';

export const fieldTypeEnum = z.enum(['TEXT', 'NUMBER', 'EMAIL', 'YES_NO', 'PASSWORD']);

export const createFormFieldInput = z.object({
    formId: z.string().uuid().describe('The ID of the form this field belongs to'),
    label: z.string().min(1).max(100).describe('The display label for the field'),
    description: z.string().optional().describe('An optional description for the field'),
    placeholder: z.string().optional().describe('An optional placeholder for the field'),
    isRequired: z.boolean().default(false).describe('Whether the field is required'),
    index: z.string().optional().describe('Fractional index for sorting (numeric string)'),
    type: fieldTypeEnum.describe('The type of the field'),
});

export type CreateFormFieldInputType = z.infer<typeof createFormFieldInput>;

export const updateFormFieldInput = z.object({
    id: z.string().uuid().describe('The ID of the field to update'),
    label: z.string().min(1).max(100).optional().describe('The display label for the field'),
    description: z.string().optional().describe('An optional description for the field'),
    placeholder: z.string().optional().describe('An optional placeholder for the field'),
    isRequired: z.boolean().optional().describe('Whether the field is required'),
    index: z.string().optional().describe('Fractional index for sorting (numeric string)'),
    type: fieldTypeEnum.optional().describe('The type of the field'),
});

export type UpdateFormFieldInputType = z.infer<typeof updateFormFieldInput>;

export const deleteFormFieldInput = z.string().uuid().describe('The ID of the field to delete');

export type DeleteFormFieldInputType = z.infer<typeof deleteFormFieldInput>;

export const getFormFieldsInput = z.string().uuid().describe('The ID of the form to get fields for');

export type GetFormFieldsInputType = z.infer<typeof getFormFieldsInput>;
