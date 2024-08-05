'use client'

import { FormValues, TransactionForm } from '@/features/transactions/components/transaction-form'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import { Loader2 } from 'lucide-react'
import React from 'react'
import { UseConfirm } from '@/hooks/use-confirm'
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction'
import { useEditTransaction } from '@/features/transactions/api/use-edit-transaction'
import { useGetTransaction } from '@/features/transactions/api/use-get-transaction'
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction'

export const EditTransactionSheet = () => {
    const { isOpen, onClose, id } = useOpenTransaction()
    const [ConfirmDialog, confirm] = UseConfirm(
        "Delete",
        "Are you sure you want to delete this transaction?"
    )

    const transactionQuery = useGetTransaction(id)

    const editMutation = useEditTransaction(id)
    const deleteMutation = useDeleteTransaction(id)

    const isPending = editMutation.isPending || deleteMutation.isPending;

    const isLoading = transactionQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
    }

    const onDelete = async () => {
        const ok = await confirm()

        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose()
                }
            })
        }
    }

    const defaultValues = transactionQuery.data ? {
        id: transactionQuery.data.id,
        date: new Date(transactionQuery.data.date),
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        payee: transactionQuery.data.payee,
        amount: transactionQuery.data.amount,
        notes: transactionQuery.data.notes
    } : {
        id: "",
        date: new Date(),
        accountId: "",
        categoryId: "",
        payee: "",
        amount: "",
        notes: ""
    }

    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className='space-y-4'>
                    <SheetHeader>
                        <SheetTitle>
                            Edit Transaction
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing transaction.
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <Loader2 className='size-4 text-muted-foreground animate-spin' />
                        </div>
                    ) : (
                        <TransactionForm
                            id={id}
                            onSubmit={onSubmit}
                            disabled={isPending}
                            defaultValues={defaultValues}
                            onDelete={onDelete}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}
