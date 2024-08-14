import { accounts, categories, transactions } from "@/db/schema";
import { and, desc, eq, gte, lt, lte, sql } from "drizzle-orm";
import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { differenceInDays, parse, subDays } from "date-fns";

import { HTTPException } from "hono/http-exception";
import { Hono } from "hono"
import { db } from "@/db/drizzle";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

interface Category {
    name: string;
    value: string;
}

interface FinancialData {
    income: string;
    expenses: string;
    remaining: string;
}

const app = new Hono()
    .get('/',
        clerkMiddleware(),
        zValidator(
            "query",
            z.object({
                from: z.string().optional(),
                to: z.string().optional(),
                accountId: z.string().optional(),
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const { from, to, accountId } = c.req.valid("query")

            if (!auth?.userId) {
                throw new HTTPException(401, { message: 'Unauthorized' });
            }

            const defaultTo = new Date();
            const defaultFrom = subDays(defaultTo, 30);

            const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
            const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

            const periodLength = differenceInDays(endDate, startDate) + 1;
            const lastPeriodStart = subDays(startDate, periodLength);
            const lastPeriodEnd = subDays(startDate, 1);

            async function fetchFinancialData(
                userId: string,
                startDate: Date,
                endDate: Date,
            ): Promise<FinancialData[]> {
                return await db
                    .select({
                        income: sql<string>`COALESCE(SUM(CASE WHEN CAST(${transactions.amount} AS DECIMAL) >= 0 THEN CAST(${transactions.amount} AS DECIMAL) ELSE 0 END), 0)::text`,
                        expenses: sql<string>`COALESCE(SUM(CASE WHEN CAST(${transactions.amount} AS DECIMAL) < 0 THEN CAST(${transactions.amount} AS DECIMAL) ELSE 0 END), 0)::text`,
                        remaining: sql<string>`COALESCE(SUM(CAST(${transactions.amount} AS DECIMAL)), 0)::text`,
                    })
                    .from(transactions)
                    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                    .where(
                        and(
                            accountId ? eq(transactions.accountId, accountId) : undefined,
                            eq(accounts.userId, userId),
                            gte(transactions.date, startDate),
                            lte(transactions.date, endDate)
                        )
                    );
            }

            const [currentPeriod] = await fetchFinancialData(
                auth.userId,
                startDate,
                endDate
            );
            const [lastPeriod] = await fetchFinancialData(
                auth.userId,
                lastPeriodStart,
                lastPeriodEnd
            );

            const incomeChange = calculatePercentageChange(
                currentPeriod.income,
                lastPeriod.income
            );

            const expensesChange = calculatePercentageChange(
                currentPeriod.expenses,
                lastPeriod.expenses
            );

            const remainingChange = calculatePercentageChange(
                currentPeriod.remaining,
                lastPeriod.remaining
            );

            const category: Category[] = await db
                .select({
                    name: categories.name,
                    value: sql<string>`COALESCE(SUM(ABS(CAST(${transactions.amount} AS DECIMAL))), 0)::text`,
                })
                .from(categories)
                .leftJoin(transactions, and(
                    eq(transactions.categoryId, categories.id),
                    gte(transactions.date, startDate),
                    lte(transactions.date, endDate)
                ))
                .leftJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        accountId ? eq(transactions.accountId, accountId) : undefined,
                        eq(categories.userId, auth.userId)
                    )
                )
                .groupBy(categories.name)
                .orderBy(desc(sql`SUM(ABS(CAST(${transactions.amount} AS DECIMAL)))`));

            const finalCategories = category.map(cat => ({
                ...cat,
                value: parseFloat(cat.value).toFixed(2)
            }));

            const activeDays = await db
                .select({
                    date: transactions.date,
                    income: sql<string>`COALESCE(SUM(CASE WHEN CAST(${transactions.amount} AS DECIMAL) >= 0 THEN CAST(${transactions.amount} AS DECIMAL) ELSE 0 END), 0)::text`,
                    expenses: sql<string>`COALESCE(SUM(CASE WHEN CAST(${transactions.amount} AS DECIMAL) < 0 THEN CAST(${transactions.amount} AS DECIMAL) ELSE 0 END), 0)::text`,
                })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        accountId ? eq(transactions.accountId, accountId) : undefined,
                        eq(accounts.userId, auth.userId),
                        gte(transactions.date, startDate),
                        lte(transactions.date, endDate)
                    )
                )
                .groupBy(transactions.date)
                .orderBy(transactions.date);

            const days = fillMissingDays(
                activeDays,
                startDate,
                endDate
            );

            return c.json({
                data: {
                    remainingAmount: currentPeriod.remaining,
                    remainingChange,
                    income: currentPeriod.income,
                    incomeChange,
                    expenses: currentPeriod.expenses,
                    expensesChange,
                    categories: finalCategories,
                    days
                }
            });
        },
    );

export default app;