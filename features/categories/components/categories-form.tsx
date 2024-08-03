'use client'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React from 'react'
import { Trash } from 'lucide-react'
import { insertCategorieSchema } from '@/db/schema'
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = insertCategorieSchema.pick({
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

export const CategoriesForm = ({ id, defaultValues, onSubmit, onDelete, disabled }: Props) => {

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
                        {id ? 'Save Changes' : 'Create category'}
                    </Button>
                    {!!id && (
                        <Button
                            type='button'
                            disabled={disabled}
                            onClick={handleDelete}
                            className="w-full"
                            variant={'outline'}
                            size={'icon'}
                        >
                            <Trash className="size-4 mr-2" />
                            Delete category
                        </Button>
                    )}
                </form>
            </Form>
        </>
    )
}