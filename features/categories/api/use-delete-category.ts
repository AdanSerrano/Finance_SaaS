import { useMutation, useQueryClient } from "@tanstack/react-query";

import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>

export const useDeleteCategory = (id: string) => {
    const queryClient = useQueryClient()
    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async () => {
            const response = await client.api.categories[":id"]["$delete"]({
                param: { id },
            })
            return response.json()
        },
        onSuccess: () => {
            toast.success("Category deleted")
            queryClient.invalidateQueries({ queryKey: ["category", { id }] })
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
            queryClient.invalidateQueries({ queryKey: ["summary"] })
        },
        onError: () => {
            // Handle error
            toast.error("Failed to delete category")
        }
    });

    return mutation;
}