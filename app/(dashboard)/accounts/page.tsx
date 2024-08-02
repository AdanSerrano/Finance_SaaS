'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Payment, columns } from '@/app/(dashboard)/accounts/components/columns'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { Plus } from 'lucide-react'
import { useNewAccount } from '@/features/accounts/hooks/use-new-account'

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },
        // ...
    ]
}
const data: Payment[] = [
    {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
    },
    {
        id: "asdfadsf",
        amount: 100,
        status: "success",
        email: "adads@example.com",
    },
]

export default function AccountsPage() {
    const newAccount = useNewAccount();
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
                        data={data}
                        filterKey='email'
                        onDelete={() => { }}
                        disabled={false}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
