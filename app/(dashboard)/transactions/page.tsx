'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { ImportCard } from './components/import-card'
import { Skeleton } from '@/components/ui/skeleton'
import { transactions as TransactionsSchemas } from '@/db/schema'
import { UploadButton } from './components/upload-button'
import { columns } from '@/app/(dashboard)/transactions/components/columns'
import { create } from 'zustand'
import { toast } from 'sonner'
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transactions'
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions'
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions'
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction'
import { useSelectAccount } from '@/hooks/use-select-account'
import { useState } from 'react'

enum VARIANT {
    LIST = 'LIST',
    IMPORT = 'IMPORT',
}

const INITIAL_IMPORT_RESULTS = {
    data: [],
    error: [],
    meta: {}
}

export default function TransactionsPage() {
    const [AccountDialog, confirm] = useSelectAccount()
    const [variant, setVariant] = useState<VARIANT>(VARIANT.LIST)
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS)

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        setImportResults(results)
        setVariant(VARIANT.IMPORT)
    }

    const onCancelImport = () => {
        setImportResults(INITIAL_IMPORT_RESULTS)
        setVariant(VARIANT.LIST)
    }

    const newTransaction = useNewTransaction();
    const createTransactions = useBulkCreateTransactions()
    const deleteTransactions = useBulkDeleteTransactions()
    const transactionsQuery = useGetTransactions()
    const transactions = transactionsQuery.data || []

    const isDisabled = deleteTransactions.isPending || transactionsQuery.isLoading

    const onSubmitImport = async (values: typeof TransactionsSchemas.$inferInsert[]) => {
        const accountId = await confirm()

        if (!accountId) {
            return toast.error('Please select an account to continue.')
        }
        const data = values.map((values) => ({
            ...values,
            accountId: accountId as string
        }))


        const onCreate = createTransactions.mutate(data, {
            onSuccess: () => {
                onCancelImport()
            }
        })


        console.log('values', { values })
        console.log('accountId', accountId)
        console.log('onCreate', onCreate)
    }

    if (transactionsQuery.isLoading) {
        return (
            <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
                <Card className='!border-none !drop-shadow-xs'>
                    <CardHeader >
                        <Skeleton className='h-8 w-48' />
                    </CardHeader>
                    <CardContent>
                        <div className='h-[500px] w-full flex items-center justify-center'>
                            <Loader2 className='size-6 text-slate-300 animate-spin' />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (variant === VARIANT.IMPORT) {
        return (
            <>
                <AccountDialog />
                <ImportCard
                    data={importResults.data}
                    onCancel={onCancelImport}
                    onSubmit={onSubmitImport}
                />
            </>
        )
    }

    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='!border-none !drop-shadow-xs'>
                <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>
                        Transactions Page
                    </CardTitle>
                    <div className='flex flex-col sm:flex-row gap-y-2 items-center gap-x-2'>
                        <Button
                            size={'sm'}
                            onClick={newTransaction.onOpen}
                            className='w-full lg:w-auto'
                        >
                            <Plus className='size-4 mr-2' />
                            Add new
                        </Button>
                        <UploadButton onUpload={onUpload} />
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={transactions}
                        filterKey='payee'
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id)
                            deleteTransactions.mutate({ ids })
                        }}
                        disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
