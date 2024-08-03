'use client';

import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet";
import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet";
import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet";
import { NewCategorytSheet } from "@/features/categories/components/new-category-sheet";
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
        </>
    )
}
