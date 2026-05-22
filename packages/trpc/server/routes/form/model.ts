import { z } from 'zod';
import { fieldTypeEnum } from '@repo/services/form-field';
import { getFormSubmissionsByFormIdInput } from '@repo/services/form-submission';

export const createFormInputModel = z.object({
    title: z.string().min(1).max(100).describe('Title of the form'),
    description: z.string().max(300).optional().describe('Description of the form'),
});

export const createFormOutputModel = z.object({
    id: z.string().describe('ID of the created form'),
});

export const listMyFormsInputModel = z.undefined();

export const listMyFormsOutputModel = z.array(z.object({
    id: z.string().describe('ID of the form'),
    title: z.string().describe('Title of the form'),
    description: z.string().describe('Description of the form').nullable(),
    createdBy: z.string().describe('UUID of the user who created the form').nullable(),
    createdAt: z.date().describe('Date the form was created').nullable(),
    updatedAt: z.date().describe('Date the form was last updated').nullable(),
}));

export const listFormsInputModel = z.undefined();

export const listFormsOutputModel = listMyFormsOutputModel;

export const getFormByIdInputModel = z.object({
    id: z.string().uuid().describe('ID of the form to retrieve'),
});

export const getFormByIdOutputModel = z.object({
    id: z.string().describe('ID of the form'),
    title: z.string().describe('Title of the form'),
    description: z.string().describe('Description of the form').nullable(),
    createdBy: z.string().describe('UUID of the user who created the form').nullable(),
    createdAt: z.date().describe('Date the form was created').nullable(),
    updatedAt: z.date().describe('Date the form was last updated').nullable(),
});

export const getFormByFormIdInputModel = z.object({
    formId: z.string().uuid().describe('ID of the form to retrieve for public sharing'),
});

const publicFormFieldModel = z.object({
    id: z.string().uuid().describe('The ID of the field'),
    label: z.string().describe('The display label for the field'),
    labelKey: z.string().describe('The slug version of the label'),
    description: z.string().nullable().describe('An optional description for the field'),
    placeholder: z.string().nullable().describe('An optional placeholder for the field'),
    isRequired: z.boolean().describe('Whether the field is required'),
    index: z.string().describe('Fractional index for sorting'),
    type: fieldTypeEnum.describe('The type of the field'),
    createdAt: z.date().nullable().describe('The date the field was created'),
    updatedAt: z.date().nullable().describe('The date the field was last updated'),
});

export const getFormByFormIdOutputModel = z.object({
    id: z.string().describe('ID of the form'),
    title: z.string().describe('Title of the form'),
    description: z.string().describe('Description of the form').nullable(),
    createdAt: z.date().describe('Date the form was created').nullable(),
    updatedAt: z.date().describe('Date the form was last updated').nullable(),
    fields: z.array(publicFormFieldModel).describe('Form fields ordered by index'),
});

export const getFormSubmissionsInputModel = getFormSubmissionsByFormIdInput;

const formSubmissionValueModel = z.object({
    formFieldId: z.string().uuid().describe('The ID of the form field'),
    value: z.string().describe('The submitted value'),
});

export const getFormSubmissionsOutputModel = z.array(
    z.object({
        id: z.string().uuid().describe('The ID of the submission'),
        formId: z.string().uuid().nullable().describe('The ID of the form'),
        values: z.array(formSubmissionValueModel).describe('Submitted field values'),
        createdAt: z.date().nullable().describe('When the submission was created'),
        updatedAt: z.date().nullable().describe('When the submission was last updated'),
    })
);
