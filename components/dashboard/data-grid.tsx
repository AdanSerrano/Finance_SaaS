'use client'

import { DataCard, DataCardLoading } from './data-card'
import { FaArrowTrendDown, FaArrowTrendUp } from 'react-icons/fa6'

import { FaPiggyBank } from 'react-icons/fa'
import { formatDateRange } from '@/lib/utils'
import { useGetSummary } from '@/features/summary/api/use-get-summary'
import { useSearchParams } from 'next/navigation'

export const DataGrid = () => {
    const { data, isLoading } = useGetSummary()
    const searchParams = useSearchParams()
    const to = searchParams.get('to') || ''
    const from = searchParams.get('from') || ''

    const dateRange = formatDateRange({ to, from })

    if (isLoading) {
        return (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8'>
                <DataCardLoading />
                <DataCardLoading />
                <DataCardLoading />
            </div>
        )
    }

    return (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8'>
            <DataCard
                title='Remainig'
                value={data?.remainingAmount}
                percentageChange={data?.remainingChange}
                icon={FaPiggyBank}
                dateRange={dateRange}
            />
            <DataCard
                title='Income'
                value={data?.incomeAmount}
                percentageChange={data?.incomeChange}
                icon={FaArrowTrendUp}
                dateRange={dateRange}
            />
            <DataCard
                title='Expenses'
                value={data?.expensesAmount}
                percentageChange={data?.expensesChange}
                icon={FaArrowTrendDown}
                dateRange={dateRange}
            />
        </div>
    )
}
