import { z } from 'zod';

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
