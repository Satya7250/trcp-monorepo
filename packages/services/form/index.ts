import { db, eq } from '@repo/database';
import { formsTable } from '@repo/database/models/form';
import { createFormInput, type CreateFormInputType, listFormByUserIdInput, type ListFormByUserIdInputType } from "./model";

class FormService {
    /**
     * Creates a new form in the database.
     * @param payload - The form data (title, description, createdBy)
     * @returns The ID of the newly created form
     */
    public async createForm(payload: CreateFormInputType) {
        // Validate the input using Zod
        const { title, description, createdBy } = await createFormInput.parseAsync(payload);

        // Insert into the database
        // Note: Using 'discription' and 'cratedBy' to match the database model schema
        const result = await db.insert(formsTable).values({
            title,
            discription: description, 
            cratedBy: createdBy,
        }).returning({
            id: formsTable.id,
        });

        if (!result || result.length === 0 || !result[0]?.id) {
            throw new Error('Failed to create form');
        }

        return {
            id: result[0].id,
        };
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
