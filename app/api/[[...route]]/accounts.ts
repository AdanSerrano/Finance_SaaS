import { accounts, insertAccountSchema } from '@/db/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';

import { HTTPException } from 'hono/http-exception'
import { Hono } from 'hono'
import { createId } from '@paralleldrive/cuid2'
import { db } from '@/db/drizzle'
import { eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';

const app = new Hono()
    .get(
        '/',
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);

            if (!auth?.userId) {
                throw new HTTPException(401, {
                    res: c.json({ error: 'Unauthorized' }, 401),
                })
            }

            const data = await db.select({
                id: accounts.id,
                name: accounts.name,
            })
                .from(accounts)
                .where(eq(accounts.userId, auth.userId))
            return c.json({ data })
        })
    .post('/',
        clerkMiddleware(),
        zValidator('json', insertAccountSchema.pick({ name: true })),
        async (c) => {
            const auth = getAuth(c);

            const value = c.req.valid('json');
            if (!auth?.userId) {
                throw new HTTPException(401, {
                    res: c.json({ error: 'Unauthorized' }, 401),
                })
            }

            const [data] = await db.insert(accounts).values({
                id: createId(),
                userId: auth.userId,
                ...value,
            }).returning()

            return c.json({ data })
        })

export default app; 