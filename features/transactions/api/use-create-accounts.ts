import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.transactions.$post>
type RequestType = InferRequestType<typeof client.api.transactions.$post>["json"]

export const useCreateTransactions = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.transactions.$post({ json })
            return response.json()
        },
        onSuccess: () => {
            toast.success("transaction created")
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
            // TODO: invalidate summary
        },
        onError: () => {
            // Handle error
            toast.error("Failed to create transaction")
        }
    });

    return mutation;
}