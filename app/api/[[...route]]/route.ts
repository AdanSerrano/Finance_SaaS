import { clerkMiddleware, getAuth } from '@hono/clerk-auth'

import { Hono } from "hono"
import authors from './authors'
import books from './books'
import { error } from 'console'
import { handle } from "hono/vercel"
import { z } from "zod"
import { zValidator } from "@hono/zod-validator"

export const runtime = "edge"

const app = new Hono().basePath("/api")

app.get('/hello', (c) => {
    return c.json({ hello: "world" })
})

// app.route("/authors", authors).route("/books", books)

// app
//     .get("/hello",
//         clerkMiddleware(),
//         helloController(),
//         // (c) => {
//         //     const auth = getAuth(c)

//         //     if (!auth?.userId) return c.json({ error: "Unauthorized", })

//         //     return c.json({
//         //         message: "Hello Next.js!",
//         //         userId: auth.userId
//         //     })
//         // }
//     )
//     .get(
//         "/hello/:test",
//         zValidator(
//             "param",
//             z.object({
//                 test: z.string(),
//             })

//         ),
//         (c) => {
//             const { test } = c.req.valid("param")
//             return c.json({
//                 message: `Hello ${test}!`,
//                 test: `${test}!`,
//             })
//         })

//     .post(
//         "/create/:postId",
//         zValidator(
//             "json",
//             z.object({
//                 name: z.string(),
//                 userId: z.number(),
//             })
//         ),
//         zValidator(
//             "param",
//             z.object({
//                 postId: z.number(),
//             })
//         ),
//         (c) => {
//             const { name, userId } = c.req.valid("json")
//             const { postId } = c.req.valid("param")
//             return c.json({
//                 message: `Hello ${name}!`,
//                 name: `${name}!`,
//                 userId: `${userId}!`,
//                 postId: `${postId}!`,
//             })
//         })


export const GET = handle(app)
export const POST = handle(app)