'use client'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { convertAmountFromMiliunits, convertAmoutToMiliunits } from "@/lib/utils"

import { AmountInput } from "@/components/amount-input"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/date-picker"
import { Input } from "@/components/ui/input"
import React from 'react'
import { ReactSelect } from "@/components/select"
import { Textarea } from "@/components/ui/textarea"
import { Trash } from 'lucide-react'
import { insertTransactionsSchemas } from '@/db/schema'
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
    date: z.coerce.date(),
    accountId: z.string(),
    categoryId: z.string().nullable().optional(),
    payee: z.string(),
    amount: z.string(),
    notes: z.string().nullable().optional(),
})

const apiSchema = insertTransactionsSchemas.omit({
    id: true,
})

export type FormValues = z.infer<typeof formSchema>
export type ApiFormValues = z.infer<typeof apiSchema>;

type Props = {
    id?: string,
    defaultValues?: FormValues,
    onSubmit: (values: ApiFormValues) => void
    onDelete?: () => void
    disabled?: boolean
    accountOptions: { label: string, value: string }[]
    onCreateAccount: (name: string) => void
    categoryOptions: { label: string, value: string }[]
    onCreateCategory: (name: string) => void
}

export const TransactionForm = ({ id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
    accountOptions,
    onCreateAccount,
    categoryOptions,
    onCreateCategory
}: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    })

    const handleSubmit = (values: FormValues) => {
        const amount = parseFloat(values.amount)
        const amountInMiliunits = convertAmoutToMiliunits(amount)
        onSubmit({
            ...values,
            amount: amountInMiliunits.toString()
        });
    }

    const handleDelete = () => {
        onDelete?.()
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-2">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <DatePicker
                                        disabled={disabled}
                                        value={field.value}
                                        onChange={(date) => field.onChange(date)}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="accountId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Account</FormLabel>
                                <FormControl>
                                    <ReactSelect
                                        placeholder="Select an account"
                                        options={accountOptions}
                                        value={field.value}
                                        onChange={field.onChange}
                                        onCreate={onCreateAccount}
                                        disabled={disabled}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <ReactSelect
                                        placeholder="Select an Category"
                                        options={categoryOptions}
                                        value={field.value}
                                        onChange={field.onChange}
                                        onCreate={onCreateCategory}
                                        disabled={disabled}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="payee"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Payee</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Optional payee"
                                        disabled={disabled}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <AmountInput
                                        value={field.value}
                                        disabled={disabled}
                                        onChange={field.onChange}
                                        placeholder="0.00"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notes</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        disabled={disabled}
                                        placeholder="Optional payee"
                                        value={field.value ?? ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        disabled={disabled}
                        className="w-full"
                    >
                        {id ? 'Save Changes' : 'Create Transaction'}
                    </Button>
                    {!!id && (
                        <Button
                            type='button'
                            disabled={disabled}
                            onClick={handleDelete}
                            className="w-full text-red-500 focus:text-red-700 hover:text-red-700"
                            variant={'outline'}
                            size={'icon'}
                        >
                            <Trash className="size-4 mr-2" />
                            Delete Transaction
                        </Button>
                    )}
                </form>
            </Form>
        </>
    )
}