import { db, eq, asc, desc } from '@repo/database';
import { formFieldsTable } from '@repo/database/models/form-field';
import { 
    createFormFieldInput, 
    type CreateFormFieldInputType, 
    updateFormFieldInput, 
    type UpdateFormFieldInputType, 
    deleteFormFieldInput, 
    type DeleteFormFieldInputType,
    getFormFieldsInput,
    type GetFormFieldsInputType
} from "./model";

class FormFieldService {
    /**
     * Generates a slug from a string for use as a labelKey.
     */
    private slugify(text: string): string {
        return text
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }

    /**
     * Creates a new form field.
     */
    public async createField(payload: CreateFormFieldInputType) {
        const validated = await createFormFieldInput.parseAsync(payload);
        
        const labelKey = this.slugify(validated.label);
        
        // If index is not provided, calculate the next one to append to the end
        const index = validated.index ?? await this.getNextIndex(validated.formId);

        const result = await db.insert(formFieldsTable).values({
            ...validated,
            labelKey,
            index,
        }).returning({
            id: formFieldsTable.id,
        });

        if (!result || result.length === 0) {
            throw new Error('Failed to create form field');
        }

        return result[0];
    }

    /**
     * Updates an existing form field.
     */
    public async updateField(payload: UpdateFormFieldInputType) {
        const validated = await updateFormFieldInput.parseAsync(payload);
        const { id, ...updateData } = validated;

        const result = await db.update(formFieldsTable)
            .set({
                ...updateData,
                updatedAt: new Date(),
            })
            .where(eq(formFieldsTable.id, id))
            .returning({
                id: formFieldsTable.id,
            });

        if (!result || result.length === 0) {
            throw new Error('Failed to update form field');
        }

        return result[0];
    }

    /**
     * Deletes a form field.
     */
    public async deleteField(id: DeleteFormFieldInputType) {
        const validatedId = await deleteFormFieldInput.parseAsync(id);

        const result = await db.delete(formFieldsTable)
            .where(eq(formFieldsTable.id, validatedId))
            .returning({
                id: formFieldsTable.id,
            });

        if (!result || result.length === 0) {
            throw new Error('Failed to delete form field');
        }

        return result[0];
    }

    /**
     * Calculates the next fractional index for a new field in a form.
     * Appends to the end by default.
     */
    public async getNextIndex(formId: string) {
        const lastField = await db.select({
            index: formFieldsTable.index,
        })
        .from(formFieldsTable)
        .where(eq(formFieldsTable.formId, formId))
        .orderBy(desc(formFieldsTable.index))
        .limit(1);

        if (!lastField || lastField.length === 0) {
            return "1.00";
        }

        const lastIndex = parseFloat(lastField[0]?.index ?? '0');
        return (lastIndex + 1.0).toFixed(2);
    }

    /**
     * Retrieves all fields for a specific form, ordered by index.
     */
    public async getFields(formId: GetFormFieldsInputType) {
        const validatedFormId = await getFormFieldsInput.parseAsync(formId);

        const result = await db.select().from(formFieldsTable)
            .where(eq(formFieldsTable.formId, validatedFormId))
            .orderBy(asc(formFieldsTable.index));

        return result;
    }
}

export default FormFieldService;
