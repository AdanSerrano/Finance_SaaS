import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useGetSummary = () => {
    const params = useSearchParams()
    const from = params.get("from") || ''
    const to = params.get("to") || ''
    const accountId = params.get("accountId") || ''

    const query = useQuery({
        queryKey: ["summary", { from, to, accountId }],
        queryFn: async () => {
            const response = await client.api.summary.$get({
                query: {
                    from,
                    to,
                    accountId,
                },
            });
            if (!response.ok) {
                throw new Error((response.statusText, "Failed to fetch summary"));
            }

            const { data } = await response.json();
            return {
                ...data,
                incomeAmount: convertAmountFromMiliunits(parseFloat(data.income)),
                expensesAmount: convertAmountFromMiliunits(parseFloat(data.expenses)),
                remainingAmount: convertAmountFromMiliunits(parseFloat(data.remainingAmount)),
                categories: data.categories.map((category) => ({
                    ...category,
                    value: convertAmountFromMiliunits(parseFloat(category.value)),
                })),
                days: data.days.map((day) => ({
                    ...day,
                    income: convertAmountFromMiliunits(parseFloat(day.income)),
                    expenses: convertAmountFromMiliunits(parseFloat(day.expenses)),
                })),
            };
        },
    });

    return query;
}