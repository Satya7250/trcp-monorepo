import { asc, db, eq } from '@repo/database';
import { formFieldsTable } from '@repo/database/models/form-field';
import { formsTable } from '@repo/database/models/form';
import {
    createFormInput,
    type CreateFormInputType,
    getFormByFormIdInput,
    type GetFormByFormIdInputType,
    listFormByUserIdInput,
    type ListFormByUserIdInputType,
} from "./model";

class FormService {
    /**
     * Creates a new form in the database.
     * @param payload - The form data (title, description, createdBy)
     * @returns The ID of the newly created form
     */
    public async createForm(payload: CreateFormInputType) {
        try {
            // Validate the input using Zod
            const { title, description, createdBy } = await createFormInput.parseAsync(payload);

            // Insert into the database
            const result = await db.insert(formsTable).values({
                title,
                discription: description ?? null, 
                cratedBy: createdBy,
            }).returning({
                id: formsTable.id,
            });

            if (!result || result.length === 0 || !result[0]?.id) {
                throw new Error('Database insert failed to return an ID');
            }

            return {
                id: result[0].id,
            };
        } catch (error: any) {
            console.error('Error in FormService.createForm:', error);
            throw new Error(`Failed to create form: ${error.message}`);
        }
    }

    /**
     * Lists all forms created by a specific user.
     * @param userId - The UUID of the user
     * @returns A list of forms
     */
    public async listFormByUserId(userId: ListFormByUserIdInputType) {
        // Validate the input using Zod
        const validatedUserId = await listFormByUserIdInput.parseAsync(userId);

        // Query the database
        const result = await db.select({
            id: formsTable.id,
            title: formsTable.title,
            description: formsTable.discription,
            createdBy: formsTable.cratedBy,
            createdAt: formsTable.createdAt,
            updatedAt: formsTable.updatedAt,
        }).from(formsTable).where(eq(formsTable.cratedBy, validatedUserId));

        return result;
    }

    /**
     * Retrieves a single form by its ID.
     * @param id - The UUID of the form
     * @returns The form details
     */
    public async getFormById(id: string) {
        const result = await db.select({
            id: formsTable.id,
            title: formsTable.title,
            description: formsTable.discription,
            createdBy: formsTable.cratedBy,
            createdAt: formsTable.createdAt,
            updatedAt: formsTable.updatedAt,
        }).from(formsTable).where(eq(formsTable.id, id));

        const form = result[0];
        if (!form) {
            throw new Error(`Form with id ${id} not found`);
        }

        return form;
    }

    /**
     * Retrieves a form by ID for public sharing (excludes owner metadata).
     * @param formId - The UUID of the form
     */
    public async getFormByFormId(formId: GetFormByFormIdInputType) {
        const validatedFormId = await getFormByFormIdInput.parseAsync(formId);

        const rows = await db
            .select({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.discription,
                createdAt: formsTable.createdAt,
                updatedAt: formsTable.updatedAt,
                field: {
                    id: formFieldsTable.id,
                    label: formFieldsTable.label,
                    labelKey: formFieldsTable.labelKey,
                    description: formFieldsTable.description,
                    placeholder: formFieldsTable.placeholder,
                    isRequired: formFieldsTable.isRequired,
                    index: formFieldsTable.index,
                    type: formFieldsTable.type,
                    createdAt: formFieldsTable.createdAt,
                    updatedAt: formFieldsTable.updatedAt,
                },
            })
            .from(formsTable)
            .leftJoin(formFieldsTable, eq(formFieldsTable.formId, formsTable.id))
            .where(eq(formsTable.id, validatedFormId))
            .orderBy(asc(formFieldsTable.index));

        const firstRow = rows[0];
        if (!firstRow) {
            throw new Error(`Form with id ${validatedFormId} not found`);
        }

        const fields = rows
            .filter((row) => row.field?.id != null)
            .map((row) => ({
                id: row.field!.id,
                label: row.field!.label,
                labelKey: row.field!.labelKey,
                description: row.field!.description ?? null,
                placeholder: row.field!.placeholder ?? null,
                isRequired: row.field!.isRequired,
                index: String(row.field!.index),
                type: row.field!.type,
                createdAt: row.field!.createdAt ?? null,
                updatedAt: row.field!.updatedAt ?? null,
            }));

        return {
            id: firstRow.id,
            title: firstRow.title,
            description: firstRow.description,
            createdAt: firstRow.createdAt,
            updatedAt: firstRow.updatedAt,
            fields,
        };
    }

    /**
     * Lists all forms in the database.
     * @returns A list of all forms
     */
    public async listForms() {
        const result = await db.select({
            id: formsTable.id,
            title: formsTable.title,
            description: formsTable.discription,
            createdBy: formsTable.cratedBy,
            createdAt: formsTable.createdAt,
            updatedAt: formsTable.updatedAt,
        }).from(formsTable);

        return result;
    }
}

export default FormService;
