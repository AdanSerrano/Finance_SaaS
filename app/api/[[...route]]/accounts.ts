import { Hono } from 'hono'
// books.ts
import { accounts } from '@/db/schema';
import { db } from '@/db/drizzle'

const app = new Hono()


app.get("/", async (c) => {
    const data = await db.select({
        id: accounts.id,
        name: accounts.name,
    }).from(accounts);

    return c.json({ data });
});

export default app; 