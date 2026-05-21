import { z } from 'zod';
import { submitFormInput } from '@repo/services/form-submission';

export const submitFormInputModel = submitFormInput;

export const submitFormOutputModel = z.object({
    id: z.string().uuid().describe('The ID of the created submission'),
});
