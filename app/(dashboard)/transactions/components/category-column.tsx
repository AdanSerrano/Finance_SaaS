import { Triangle, TriangleAlert } from 'lucide-react'

import { EditTransactionSheet } from '@/features/transactions/components/edit-transaction-sheet'
import React from 'react'
import { cn } from '@/lib/utils'
import { useEditTransaction } from '@/features/transactions/api/use-edit-transaction'
import { useOpenCategory } from '@/features/categories/hooks/use-open-category'
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction'

interface CategoryColumnProps {
    id: string
    category: string | null
    categoryId: string | null
}

export const CategoryColumn = ({
    id,
    category,
    categoryId
}: CategoryColumnProps) => {
    const { onOpen: onOpenCategory } = useOpenCategory()
    const { onOpen } = useOpenTransaction()

    const onClick = () => {
        if (categoryId) {
            onOpenCategory(categoryId)
        } else {
            onOpen(id)
        }
    }
    return (
        <div
            onClick={onClick}
            className={cn(
                'flex items-center cursor-pointer hover:underline',
                !category && 'text-rose-500'
            )}
        >
            {!category && <TriangleAlert className='size-4 mr-2 shrink-0' />}
            {category || 'Uncategorized'}
        </div>
    )
}
