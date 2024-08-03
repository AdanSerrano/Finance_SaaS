'use client'

import { CategoriesForm, FormValues } from '@/features/categories/components/categories-form'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import React from 'react'
import { toast } from 'sonner'
import { useCreateCategory } from '@/features/categories/api/use-create-category'
import { useNewCategories } from '../hooks/use-new-categories'

export const NewCategorytSheet = () => {
    const { isOpen, onClose } = useNewCategories()

    const mutation = useCreateCategory()

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose()
            },
            onError: () => {
                toast.error('Failed to create account')
            }
        })
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className='space-y-4'>
                <SheetHeader>
                    <SheetTitle>
                        New Category
                    </SheetTitle>
                    <SheetDescription>
                        Create a new category to track your transaction.
                    </SheetDescription>
                </SheetHeader>
                <CategoriesForm
                    onSubmit={onSubmit}
                    disabled={mutation.isPending}
                    defaultValues={{
                        name: ''
                    }}
                />
            </SheetContent>
        </Sheet>
    )
}
