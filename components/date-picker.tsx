import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import React from 'react'
import { SelectSingleEventHandler } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { es } from 'date-fns/locale'
import { format } from 'date-fns'

interface DatePickerProps {
    value?: Date
    onChange: SelectSingleEventHandler
    disabled?: boolean
}

export const DatePicker = ({
    value,
    onChange,
    disabled
}: DatePickerProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground"
                    )}
                    variant={'outline'}
                >
                    <CalendarIcon className='size-4 mr-2' />
                    {value ? format(value, 'PPP', { locale: es }) : "Select a date"}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Calendar
                    mode='single'
                    selected={value}
                    onSelect={onChange}
                    disabled={disabled}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
