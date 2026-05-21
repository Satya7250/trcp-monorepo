import { z } from 'zod';

export const formSubmissionValueInput = z.object({
    formFieldId: z.string().uuid().describe('The ID of the form field'),
    value: z.string().describe('The submitted value as a string'),
});

export const submitFormInput = z.object({
    formId: z.string().uuid().describe('The ID of the form being submitted'),
    values: z
        .array(formSubmissionValueInput)
        .describe('Answers keyed by form field ID'),
});

export type SubmitFormInputType = z.infer<typeof submitFormInput>;
