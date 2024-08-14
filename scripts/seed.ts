import { accounts, categories, transactions } from '../db/schema';
import { addMonths, subDays, subMonths } from 'date-fns';

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const SEED_USER_ID = 'user_2jg2v6IeMB3oXkZY1ZGtUIROn8n'
const SEED_CATEGORIES = [
    { id: 'category_1', name: 'Groceries', userId: SEED_USER_ID, plaidId: null },
    { id: 'category_2', name: 'Rent', userId: SEED_USER_ID, plaidId: null },
    { id: 'category_3', name: 'Utilities', userId: SEED_USER_ID, plaidId: null },
    { id: 'category_4', name: 'Transportation', userId: SEED_USER_ID, plaidId: null },
    { id: 'category_5', name: 'Entertainment', userId: SEED_USER_ID, plaidId: null },
    { id: 'category_6', name: 'Health', userId: SEED_USER_ID, plaidId: null },
    { id: 'category_7', name: 'Insurance', userId: SEED_USER_ID, plaidId: null },
    { id: 'category_8', name: 'Personal Care', userId: SEED_USER_ID, plaidId: null },
    { id: 'category_9', name: 'Miscellaneous', userId: SEED_USER_ID, plaidId: null },
];

const SEED_ACCOUNTS = [
    { id: 'account_1', name: 'Checking', userId: SEED_USER_ID, plaidId: null },
    { id: 'account_2', name: 'Savings', userId: SEED_USER_ID, plaidId: null },
    { id: 'account_3', name: 'Credit Card', userId: SEED_USER_ID, plaidId: null },
    { id: 'account_4', name: 'Card', userId: SEED_USER_ID, plaidId: null },
    { id: 'account_6', name: 'Update Card', userId: SEED_USER_ID, plaidId: null },
];

// Función para generar transacciones aleatorias
const generateTransactions = (numTransactions: number) => {
    const transactions = [];
    const startDate = subMonths(new Date(), 2);
    const endDate = addMonths(new Date(), 2);

    for (let i = 0; i < numTransactions; i++) {
        const amount = (Math.random() * 40 + 10).toFixed(2); // Entre 10 y 50
        const isNegative = Math.random() < 0.5; // 50% de probabilidad de ser negativo

        transactions.push({
            id: `transaction_${i + 1}`,
            amount: isNegative ? `-${amount}` : amount,
            payee: `Payee ${i + 1}`,
            notes: `Note for transaction ${i + 1}`,
            date: new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())),
            accountId: SEED_ACCOUNTS[Math.floor(Math.random() * SEED_ACCOUNTS.length)].id,
            categoryId: SEED_CATEGORIES[Math.floor(Math.random() * SEED_CATEGORIES.length)].id,
            userId: SEED_USER_ID,
        });
    }
    return transactions;
};

const SEED_TRANSACTIONS = generateTransactions(150); // Generar 150 transacciones aleatorias

async function seed() {
    try {
        // Insertar categorías
        await db.insert(categories).values(SEED_CATEGORIES);
        console.log('Categories seeded successfully');

        // Insertar cuentas
        await db.insert(accounts).values(SEED_ACCOUNTS);
        console.log('Accounts seeded successfully');

        // Insertar transacciones
        await db.insert(transactions).values(SEED_TRANSACTIONS);
        console.log('Transactions seeded successfully');

        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        process.exit(0);
    }
}

seed();