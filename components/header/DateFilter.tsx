'use client'

import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format, subDays } from 'date-fns'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Calendar } from '../ui/calendar'
import { ChevronDownIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { formatDateRange } from '@/lib/utils'
import qs from 'query-string'
import { useGetSummary } from '@/features/summary/api/use-get-summary'
import { useState } from 'react'

export const DateFilter = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const accountId = searchParams.get('accountId') || 'all'
    const from = searchParams.get('from') || ''
    const to = searchParams.get('to') || ''
    const { isLoading: isLoadingSummary } = useGetSummary()

    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    const paramsState = {
        from: from ? new Date(from) : defaultFrom,
        to: to ? new Date(to) : defaultTo,
    }

    const [date, setDate] = useState<DateRange | undefined>(paramsState)

    const pushUrl = (date: DateRange | undefined) => {
        const query = {
            accountId,
            from: format(date?.from || defaultFrom, 'yyyy-MM-dd'),
            to: format(date?.to || defaultTo, 'yyyy-MM-dd'),
        }

        const url = qs.stringifyUrl({
            url: pathname,
            query
        }, { skipNull: true, skipEmptyString: true })

        router.push(url)
    }

    const onReset = () => {
        setDate(undefined)
        pushUrl(undefined)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    disabled={isLoadingSummary}
                    variant={'outline'}
                    size={'sm'}
                    className='lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition'
                >
                    <span>{formatDateRange()}</span>
                    <ChevronDownIcon className='size-4 ml-2 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className='lg:w-auto w-full p-0'
                align='start'
            >
                <Calendar
                    disabled={false}
                    initialFocus
                    mode='range'
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                />
                <div className='p-4 w-full flex items-center gap-x-2'>
                    <PopoverClose asChild>
                        <Button
                            onClick={onReset}
                            disabled={!date?.from || !date?.to}
                            className='w-full'
                            variant={'outline'}
                        >
                            Reset
                        </Button>
                    </PopoverClose>
                    <PopoverClose asChild>
                        <Button
                            onClick={() => pushUrl(date)}
                            disabled={!date?.from || !date?.to}
                            className='w-full'
                        >
                            Apply
                        </Button>
                    </PopoverClose>
                </div>
            </PopoverContent>
        </Popover>
    )
}
