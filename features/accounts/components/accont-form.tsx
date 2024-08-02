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
import { FormValue } from 'hono/types'
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
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4 pt-4"
                >
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

                    <div className="my-4">
                        <Button
                            disabled={disabled}
                            className="w-full"
                        >
                            {id ? 'Saves Change' : 'Create Account'}
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
                                delete account
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </>
    )
}
