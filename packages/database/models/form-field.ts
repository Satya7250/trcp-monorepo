import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  numeric,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { formsTable, usersTable } from "../schema";


export const fieldTypesEnum = pgEnum("field_types", ['TEXT', 'NUMBER', 'EMAIL', 'YES_NO', 'PASSWORD']);

export const formFieldsTable = pgTable("form_fields", {
    id: uuid("id").primaryKey().defaultRandom(),

    label: varchar("label", { length: 100 }).notNull(),
    labelKey: varchar("label_key", { length: 100 }).notNull(),

    description: text("description"),

    placeholder: text("placeholder"),

    isRequired: boolean("is_required").default(false).notNull(),

    index: numeric("index", { precision: 10, scale: 2 }).notNull(),

    type: fieldTypesEnum("type").notNull(),

    formId: uuid("form_id").references(() => formsTable.id),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),

}, (table) => {
    return {
        uniqueFormIdAndIndex: unique().on(table.formId, table.index),
    }
})