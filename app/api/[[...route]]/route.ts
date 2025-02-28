import { HTTPException } from "hono/http-exception"
import { Hono } from "hono"
import accounts from '@/app/api/[[...route]]/accounts'
import categories from '@/app/api/[[...route]]/categories'
import { handle } from "hono/vercel"
import summary from '@/app/api/[[...route]]/summary'
import transactions from '@/app/api/[[...route]]/transactions'

export const runtime = "edge"

const app = new Hono().basePath("/api")

app.onError((err, c) => {
    if (err instanceof HTTPException) {
        return err.getResponse();
    }

    return c.json({ error: (err.message, 'Internal error'), }, 500)
});

const routes = app
    .route("/accounts", accounts)
    .route("/categories", categories)
    .route("/transactions", transactions)
    .route("/summary", summary)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes;