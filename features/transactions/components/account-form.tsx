'use client'

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React from 'react'
import { Trash } from 'lucide-react'
import { insertAccountSchema } from '@/db/schema'
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = insertAccountSchema.pick({
    name: true
})

export type FormValues = z.infer<typeof formSchema>

type Props = {
    id?: string,
    defaultValues?: FormValues,
    onSubmit: (values: FormValues) => void
    onDelete?: () => void
    disabled?: boolean
}

export const AccountForm = ({ id, defaultValues, onSubmit, onDelete, disabled }: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    })

    const handleSubmit = (values: FormValues) => {
        onSubmit(values)
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={disabled}
                                        placeholder="name"
                                        {...field}
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
                        {id ? 'Save Changes' : 'Create Account'}
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
                            Delete Account
                        </Button>
                    )}
                </form>
            </Form>
        </>
    )
}