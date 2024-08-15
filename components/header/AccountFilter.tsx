'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import qs from 'query-string'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useGetSummary } from '@/features/summary/api/use-get-summary'

export const AccountFilter = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const accountId = searchParams.get('accountId') || 'all'
    const from = searchParams.get('from') || ''
    const to = searchParams.get('to') || ''

    const { isLoading: isLoadingSummary } = useGetSummary()
    const { data: accounts, isLoading: isLoadingAccounts } = useGetAccounts()

    const handleValueChange = (newValue: string) => {
        const query = {
            accountId: newValue,
            from,
            to,
        }

        if (newValue === 'all') {
            query.accountId = "";
        }

        const url = qs.stringifyUrl({
            url: pathname,
            query
        }, { skipNull: true, skipEmptyString: true })

        router.push(url)
    }
    return (
        <Select
            value={accountId}
            onValueChange={handleValueChange}
            disabled={isLoadingAccounts || isLoadingSummary}
        >
            <SelectTrigger
                className='lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition'
            >
                <SelectValue placeholder='Account' />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='all'>
                    All accounts
                </SelectItem>
                {accounts?.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                        {account.name}
                    </SelectItem>
                ))}
            </SelectContent>

        </Select>
    )
}
