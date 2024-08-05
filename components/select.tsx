"use client"

import { FormValues, TransactionForm } from '@/features/transactions/components/transaction-form'

import CreatableSelect from 'react-select/creatable'
import { SingleValue } from 'react-select'
import { useMemo } from 'react'

type SelectProps = {
    onChange: (value?: string) => void
    onCreate?: (value: string) => void
    options: { label: string, value: string }[]
    value?: string | null
    disabled?: boolean
    placeholder?: string
}

export const ReactSelect = ({
    onChange,
    onCreate,
    options = [],
    value,
    disabled,
    placeholder
}: SelectProps) => {

    const onSelect = (
        option: SingleValue<{ label: string, value: string }>
    ) => {
        onChange(option?.value)
    }

    const formattedValue = useMemo(() => {
        return options.find((option) => option.value === value)
    }, [options, value])

    return (
        <CreatableSelect
            placeholder={placeholder}
            className='text-sm h-10'
            styles={{
                control: (styles) => ({
                    ...styles,
                    borderColor: '#e2e8f0',
                    ":hover": {
                        borderColor: '#e2e8f0'
                    }
                }),
            }}
            options={options}
            value={formattedValue}
            onChange={onSelect}
            onCreateOption={onCreate}
            isDisabled={disabled}
        />
    )

}