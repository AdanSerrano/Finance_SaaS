import * as schema from './schema';

import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DIRZZLE_DATABASE_URL!);

export const db = drizzle(sql, { schema });
