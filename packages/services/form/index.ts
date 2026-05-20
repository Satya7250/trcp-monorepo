import { db } from '@repo/database';
import { formsTable } from '@repo/database/models/form';
import { createFormInput, type CreateFormInputType } from "./model";

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
}

export default FormService;
