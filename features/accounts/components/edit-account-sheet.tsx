'use client'

import { AccountForm, FormValues } from '@/features/accounts/components/accont-form'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import { Loader2 } from 'lucide-react'
import React from 'react'
import { UseConfirm } from '@/hooks/use-confirm'
import { toast } from 'sonner'
import { useCreateAccount } from '@/features/accounts/api/use-create-accounts'
import { useGetAccount } from '@/features/accounts/api/use-get-account'
import { useOpenAccount } from '@/features/accounts/hooks/use-open-account'

export const EditAccountSheet = () => {
    const { isOpen, onClose, id } = useOpenAccount()

    const mutation = useCreateAccount()

    const accountQuery = useGetAccount(id)

    const isLoading = accountQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
    }

    const defaultValues = accountQuery.data ? {
        name: accountQuery.data.name
    } : {
        name: ""
    }

    return (
        <>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className='space-y-4'>
                    <SheetHeader>
                        <SheetTitle>
                            Edit Account
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing account.
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <Loader2 className='size-4 text-muted-foreground animate-spin' />
                        </div>
                    ) : (
                        <AccountForm
                            id={id}
                            onSubmit={onSubmit}
                            disabled={mutation.isPending}
                            defaultValues={defaultValues}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}
