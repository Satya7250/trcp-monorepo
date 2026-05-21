import { z } from 'zod';

export const createFormInput = z.object({
    title: z.string().min(1).max(100).describe('Title of the form'),
    description: z.string().max(300).optional().describe('Description of the form'),
    createdBy: z.string().uuid().describe('UUID of the user who created the form'),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;

export const listFormByUserIdInput = z.string().uuid().describe('UUID of the user who created the form');

export type ListFormByUserIdInputType = z.infer<typeof listFormByUserIdInput>;

export const getFormByFormIdInput = z
    .string()
    .uuid()
    .describe('The ID of the form to retrieve');

export type GetFormByFormIdInputType = z.infer<typeof getFormByFormIdInput>;
