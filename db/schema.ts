import { pgTable, text } from "drizzle-orm/pg-core";

import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
});

const customSchema = {
    name: z.string().min(1, "Name cannot be empty")
};

export const insertAccountSchema = createInsertSchema(accounts).extend(customSchema);