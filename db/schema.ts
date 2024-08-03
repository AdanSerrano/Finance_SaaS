import { date, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
});
export const accountsRelation = relations(accounts, ({ many }) => ({
    transactions: many(transactions)
}))

const customSchema = {
    name: z.string().min(1, "Name cannot be empty")
};

export const insertAccountSchema = createInsertSchema(accounts).extend(customSchema);

export const categories = pgTable("categories", {
    id: text("id").primaryKey(),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
});

export const categoriesRelation = relations(categories, ({ many }) => ({
    transactions: many(transactions)
}))

const categoriesSchema = {
    name: z.string().min(1, "Name cannot be empty")
};



export const insertCategorieSchema = createInsertSchema(categories).extend(categoriesSchema);


export const transactions = pgTable("transactions", {
    id: text("id").primaryKey(),
    amount: integer("amount").notNull(),
    payee: text("payee").notNull(),
    notes: text("notes"),
    date: timestamp("date", { mode: "date" }).notNull(),
    accountId: text("account_id").references(() => accounts.id, {
        onDelete: "cascade"
    }).notNull(),
    categoryId: text("category_id").references(() => categories.id, {
        onDelete: "set null"
    }).notNull(),
    userId: text("user_id").notNull()
})

export const transactionsRelation = relations(transactions, ({ one }) => ({
    account: one(accounts, {
        fields: [transactions.accountId],
        references: [accounts.id]
    }),
    categories: one(categories, {
        fields: [transactions.categoryId],
        references: [categories.id]
    }),
}))

export const insertTransactionsSchemas = createInsertSchema(transactions, {
    date: z.coerce.date()
})