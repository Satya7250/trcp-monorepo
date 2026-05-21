import { publicProcedure, router } from '../../trpc';
import { generatePath } from '../../utils/path-generator';
import { submitFormInputModel, submitFormOutputModel } from './model';
import { formSubmissionService } from '../../services/index';

const TAGS = ['Form Submission'];
const getPath = generatePath('/form-submission');

export const formSubmissionRouter = router({
    submitForm: publicProcedure
        .meta({
            openapi: {
                method: 'POST',
                path: getPath('/submitForm'),
                tags: TAGS,
            },
        })
        .input(submitFormInputModel)
        .output(submitFormOutputModel)
        .mutation(async ({ input }) => {
            return await formSubmissionService.submitForm(input);
        }),
});
