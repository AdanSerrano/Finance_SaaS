import { FormValues, TransactionForm } from '@/features/transactions/components/transaction-form';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import { Loader2 } from 'lucide-react';
import React from 'react';
import { UseConfirm } from '@/hooks/use-confirm';
import { useCreateAccount } from '@/features/accounts/api/use-create-accounts';
import { useCreateCategory } from '@/features/categories/api/use-create-category';
import { useCreateTransactions } from '@/features/transactions/api/use-create-transaction';
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction';
import { useEditTransaction } from '@/features/transactions/api/use-edit-transaction';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useGetTransaction } from '@/features/transactions/api/use-get-transaction';
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction';
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction';

export const EditTransactionSheet = () => {
    const { isOpen, onClose, id } = useOpenTransaction();
    const [ConfirmDialog, confirm] = UseConfirm(
        "Delete",
        "Are you sure you want to delete this transaction?"
    );

    const transactionQuery = useGetTransaction(id);
    const editMutation = useEditTransaction(id);
    const deleteMutation = useDeleteTransaction(id);
    const categoryQuery = useGetCategories();
    const categoryMutation = useCreateCategory();
    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();

    const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id,
    }));

    const onCreateAccount = (name: string) => accountMutation.mutate({ name });
    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id,
    }));

    const isPending = editMutation.isPending || deleteMutation.isPending || transactionQuery.isLoading || categoryMutation.isPending || accountMutation.isPending;

    const isLoading = transactionQuery.isLoading || categoryQuery.isLoading || accountQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const onDelete = async () => {
        const ok = await confirm();

        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    const defaultValues = transactionQuery.data ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
    } : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: "",
    };

    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>Edit Transaction</SheetTitle>
                        <SheetDescription>Edit an existing transaction.</SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>
                    ) : (
                        <TransactionForm
                            id={id}
                            onSubmit={onSubmit}
                            disabled={isPending}
                            categoryOptions={categoryOptions}
                            onCreateCategory={onCreateCategory}
                            accountOptions={accountOptions}
                            onCreateAccount={onCreateAccount}
                            defaultValues={defaultValues}
                            onDelete={onDelete}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
};