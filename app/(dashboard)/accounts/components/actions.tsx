'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { UseConfirm } from "@/hooks/use-confirm"
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account"
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account"

interface Props {
    id: string
}

export const Actions = ({ id }: Props) => {
    const [ConfirmationDialog, confirm] = UseConfirm(
        "Delete",
        "Are you sure you want to delete this account?"
    )
    const deleteMutation = useDeleteAccount(id)
    const { onOpen } = useOpenAccount()

    const onDelete = async () => {
        const ok = await confirm()

        if (ok) {
            deleteMutation.mutate()
        }
    }
    return (
        <>
            <ConfirmationDialog />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant={'ghost'}
                        className="size-8 p-0"
                    >
                        <MoreHorizontal className="size-4 " />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        disabled={deleteMutation.isPending}
                        onClick={() => onOpen(id)}
                    >
                        <Edit className="size-4 mr-2" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-red-500 hover:text-red-700 focus:text-red-700"
                        disabled={deleteMutation.isPending}
                        onClick={onDelete}
                    >
                        <Trash className="size-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
