'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { Skeleton } from '@/components/ui/skeleton'
import { columns } from '@/app/(dashboard)/accounts/components/columns'
import { useBulkDeleteAccounts } from '@/features/accounts/api/use-bulk-delete-accounts'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useNewAccount } from '@/features/accounts/hooks/use-new-account'

export default function AccountsPage() {
    const newAccount = useNewAccount();
    const deleteAccounts = useBulkDeleteAccounts()
    const accountsQuery = useGetAccounts()
    const accounts = accountsQuery.data || []

    const isDisabled = deleteAccounts.isPending || accountsQuery.isLoading

    if (accountsQuery.isLoading) {
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

    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='!border-none !drop-shadow-xs'>
                <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>
                        Accounts Page
                    </CardTitle>
                    <Button
                        size={'sm'}
                        onClick={newAccount.onOpen}
                    >
                        <Plus className='size-4 mr-2' />
                        Add new
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={accounts}
                        filterKey='name'
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id)
                            deleteAccounts.mutate({ ids })
                        }}
                        disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
