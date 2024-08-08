import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import React from 'react'
import { cn } from '@/lib/utils'

interface TableHeadSelectProps {
    columnsIndex: number
    selectColumns: Record<string, string | null>
    onChange: (columnIndex: number, value: string | null) => void
}

const OPTION = [
    'amount',
    'payee',
    'date',
]

export const TableHeadSelect = ({
    columnsIndex,
    selectColumns,
    onChange
}: TableHeadSelectProps) => {
    const currentSelected = selectColumns[`column_${columnsIndex}`]
    return (
        <Select
            value={currentSelected || ''}
            onValueChange={(value) => onChange(columnsIndex, value)}
        >
            <SelectTrigger className={cn(
                'focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize',
                currentSelected && 'text-blue-500'
            )}>
                <SelectValue placeholder={'Skip'} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='skip'>Skip</SelectItem>
                {OPTION.map((option, index) => {
                    const disabled =
                        Object.values(selectColumns).includes(option)
                        && selectColumns[`column_${columnsIndex}`] !== option
                    return (
                        <SelectItem
                            key={index}
                            value={option}
                            disabled={disabled}
                            className='capitalize'
                        >
                            {option}
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    )
}
