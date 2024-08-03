import { and, eq, inArray } from 'drizzle-orm';
import { categories, insertCategorieSchema } from '@/db/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';

import { HTTPException } from 'hono/http-exception'
import { Hono } from 'hono'
import { createId } from '@paralleldrive/cuid2'
import { db } from '@/db/drizzle'
import { z } from 'zod';
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
                id: categories.id,
                name: categories.name,
            })
                .from(categories)
                .where(eq(categories.userId, auth.userId))
            return c.json({ data })
        })
    .post('/',
        clerkMiddleware(),
        zValidator('json', insertCategorieSchema.pick({ name: true })),
        async (c) => {
            const auth = getAuth(c);

            const value = c.req.valid('json');
            if (!auth?.userId) {
                throw new HTTPException(401, {
                    res: c.json({ error: 'Unauthorized' }, 401),
                })
            }

            const [data] = await db.insert(categories).values({
                id: createId(),
                userId: auth.userId,
                ...value,
            }).returning()

            return c.json({ data })
        })
    .post('/bulk-delete',
        clerkMiddleware(),
        zValidator('json',
            z.object({
                ids: z.array(z.string())
            })
        ),
        async (c) => {
            const auth = getAuth(c);

            const value = c.req.valid('json');
            if (!auth?.userId) {
                throw new HTTPException(401, {
                    res: c.json({ error: 'Unauthorized' }, 401),
                })
            }

            const data = await db
                .delete(categories)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        inArray(categories.id, value.ids)
                    )
                )
                .returning({
                    id: categories.id,
                })

            return c.json({ data })
        }
    )
    .get('/:id',
        clerkMiddleware(),
        zValidator("param", z.object({ id: z.string() })),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param")

            if (!id) {
                return c.json({ error: 'Bad request' }, 400)
            }

            if (!auth?.userId) {
                throw new HTTPException(401, {
                    res: c.json({ error: 'Unauthorized' }, 401),
                })
            }

            const [data] = await db
                .select({
                    id: categories.id,
                    name: categories.name,
                })
                .from(categories)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        eq(categories.id, id)
                    ),
                );

            if (!data) {
                return c.json({ error: 'Not found' }, 404)
            }

            return c.json({ data })
        }
    )
    .patch('/:id',
        clerkMiddleware(),
        zValidator('json', insertCategorieSchema.pick({ name: true })),
        zValidator('param', z.object({ id: z.string() })),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid('param');
            const value = c.req.valid('json');

            if (!auth?.userId) {
                throw new HTTPException(401, {
                    res: c.json({ error: 'Unauthorized' }, 401),
                })
            }

            const [data] = await db
                .update(categories)
                .set(value)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        eq(categories.id, id)
                    )
                )
                .returning()

            if (!data) {
                return c.json({ error: 'Not found' }, 404)
            }

            return c.json({ data })
        }
    )
    .delete('/:id',
        clerkMiddleware(),
        zValidator('param', z.object({ id: z.string() })),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid('param');

            if (!auth?.userId) {
                throw new HTTPException(401, {
                    res: c.json({ error: 'Unauthorized' }, 401),
                })
            }

            const [data] = await db
                .delete(categories)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        eq(categories.id, id)
                    )
                )
                .returning({
                    id: categories.id
                })

            if (!data) {
                return c.json({ error: 'Not found' }, 404)
            }

            return c.json({ data })
        }
    )
export default app; 