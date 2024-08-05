'use client'

import { FormValues, TransactionForm } from '@/features/transactions/components/transaction-form'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import { Loader2 } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import { useCreateAccount } from '@/features/accounts/api/use-create-accounts'
import { useCreateCategory } from '@/features/categories/api/use-create-category'
import { useCreateTransactions } from '@/features/transactions/api/use-create-transaction'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction'

export const NewTransactionSheet = () => {
    const { isOpen, onClose } = useNewTransaction()

    const createMutation = useCreateTransactions()

    const categoryQuery = useGetCategories()
    const categoryMutation = useCreateCategory()
    const onCreateCategory = (name: string) => categoryMutation.mutate({ name })
    const categoryOpcions = (categoryQuery.data ?? [])?.map((category) => ({
        label: category.name,
        value: category.id
    }))

    const accountQuery = useGetAccounts()
    const accountMutation = useCreateAccount()
    const onCreateAccount = (name: string) => accountMutation.mutate({ name })
    const accountOpcions = (accountQuery.data ?? [])?.map((account) => ({
        label: account.name,
        value: account.id
    }))

    const isPending = createMutation.isPending || categoryMutation.isPending || accountMutation.isPending

    const isLoading = categoryQuery.isLoading || accountQuery.isLoading

    const onSubmit = (values: FormValues) => {
        createMutation.mutate(values, {
            onSuccess: () => {
                onClose()
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className='space-y-4'>
                <SheetHeader>
                    <SheetTitle>
                        New Account
                    </SheetTitle>
                    <SheetDescription>
                        Create a new account to track your transaction.
                    </SheetDescription>
                </SheetHeader>
                {isLoading ? (
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <Loader2 className='size-4 text-muted-foreground animate-spin' />
                    </div>
                ) : (
                    <TransactionForm
                        onSubmit={onSubmit}
                        disabled={createMutation.isPending}

                        categoryOptions={categoryOpcions}
                        onCreateCategory={onCreateCategory}

                        accountOptions={accountOpcions}
                        onCreateAccount={onCreateAccount}

                    // defaultValues={{
                    //     date: new Date(),
                    //     amount: ,
                    //     categoryId: "",
                    //     accountId: "",
                    //     notes: "",
                    // }}
                    />
                )}
            </SheetContent>
        </Sheet>
    )
}
