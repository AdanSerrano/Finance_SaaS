'use client';

import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet";
import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet";
import { EditTransactionSheet } from "@/features/transactions/components/edit-transaction-sheet";
import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet";
import { NewCategorytSheet } from "@/features/categories/components/new-category-sheet";
import { NewTransactionSheet } from "@/features/transactions/components/new-transaction-sheet";
import { useMountedState } from 'react-use'

export const SheetProvider = () => {
    const isMounted = useMountedState()

    if (!isMounted) return null

    return (
        <>
            <NewAccountSheet />
            <EditAccountSheet />

            <EditCategorySheet />
            <NewCategorytSheet />

            <EditTransactionSheet />
            <NewTransactionSheet />
        </>
    )
}
