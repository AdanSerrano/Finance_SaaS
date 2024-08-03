'use client'

import { AccountForm, FormValues } from '@/features/accounts/components/account-form'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import React from 'react'
import { toast } from 'sonner'
import { useCreateAccount } from '@/features/accounts/api/use-create-accounts'
import { useNewAccount } from '@/features/accounts/hooks/use-new-account'

export const NewAccountSheet = () => {
    const { isOpen, onClose } = useNewAccount()

    const mutation = useCreateAccount()

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
                        New Account
                    </SheetTitle>
                    <SheetDescription>
                        Create a new account to track your transaction.
                    </SheetDescription>
                </SheetHeader>
                <AccountForm
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
