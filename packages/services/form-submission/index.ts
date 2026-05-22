import { z } from 'zod';
import { db, desc, eq } from '@repo/database';
import { formFieldsTable } from '@repo/database/models/form-field';
import {
    formSubmissionTable,
    type FormSubmissionValueRow,
} from '@repo/database/models/form-submission';
import { formsTable } from '@repo/database/models/form';
import {
    getFormSubmissionsByFormIdInput,
    type GetFormSubmissionsByFormIdInputType,
    submitFormInput,
    type SubmitFormInputType,
} from './model';

const zodEmail = z.string().email();

class FormSubmissionService {
    /**
     * Creates a public form submission after validating form, fields, and required answers.
     */
    public async submitForm(payload: SubmitFormInputType) {
        const { formId, values } = await submitFormInput.parseAsync(payload);

        const form = await db
            .select({ id: formsTable.id })
            .from(formsTable)
            .where(eq(formsTable.id, formId));

        if (!form[0]) {
            throw new Error(`Form with id ${formId} not found`);
        }

        const fields = await db
            .select({
                id: formFieldsTable.id,
                isRequired: formFieldsTable.isRequired,
                type: formFieldsTable.type,
            })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId));

        const fieldById = new Map(fields.map((field) => [field.id, field]));
        const seenFieldIds = new Set<string>();
        const normalizedValues: FormSubmissionValueRow = [];

        for (const entry of values) {
            if (seenFieldIds.has(entry.formFieldId)) {
                throw new Error(`Duplicate submission for field ${entry.formFieldId}`);
            }

            const field = fieldById.get(entry.formFieldId);
            if (!field) {
                throw new Error(`Field ${entry.formFieldId} does not belong to this form`);
            }

            const trimmedValue = entry.value.trim();

            if (field.type === 'EMAIL' && trimmedValue && !zodEmail.safeParse(trimmedValue).success) {
                throw new Error(`Invalid email for field ${entry.formFieldId}`);
            }

            seenFieldIds.add(entry.formFieldId);
            normalizedValues.push({
                formFieldId: entry.formFieldId,
                value: trimmedValue,
            });
        }

        const valueByFieldId = new Map(
            normalizedValues.map((entry) => [entry.formFieldId, entry.value])
        );

        const missingRequired = fields.filter((field) => {
            if (!field.isRequired) return false;
            const value = valueByFieldId.get(field.id);
            return value === undefined || value === '';
        });

        if (missingRequired.length > 0) {
            throw new Error('Missing required field values');
        }

        const result = await db
            .insert(formSubmissionTable)
            .values({
                formId,
                values: normalizedValues,
            })
            .returning({ id: formSubmissionTable.id });

        const submission = result[0];
        if (!submission) {
            throw new Error('Failed to create form submission');
        }

        return { id: submission.id };
    }

    /**
     * Lists all submissions for a form, newest first.
     */
    public async getFormSubmissionsByFormId(payload: GetFormSubmissionsByFormIdInputType) {
        const { formId } = await getFormSubmissionsByFormIdInput.parseAsync(payload);

        const form = await db
            .select({ id: formsTable.id })
            .from(formsTable)
            .where(eq(formsTable.id, formId));

        if (!form[0]) {
            throw new Error(`Form with id ${formId} not found`);
        }

        const submissions = await db
            .select({
                id: formSubmissionTable.id,
                formId: formSubmissionTable.formId,
                values: formSubmissionTable.values,
                createdAt: formSubmissionTable.createdAt,
                updatedAt: formSubmissionTable.updatedAt,
            })
            .from(formSubmissionTable)
            .where(eq(formSubmissionTable.formId, formId))
            .orderBy(desc(formSubmissionTable.createdAt));

        return submissions.map((submission) => ({
            id: submission.id,
            formId: submission.formId,
            values: submission.values ?? [],
            createdAt: submission.createdAt,
            updatedAt: submission.updatedAt,
        }));
    }
}

export * from './model';
export default FormSubmissionService;
