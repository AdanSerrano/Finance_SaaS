import { Info, MinusCircle, PlusCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Button } from '@/components/ui/button';
import CurrencyInput from 'react-currency-input-field';
import { cn } from '@/lib/utils';

interface AmountInputProps {
    value: string;
    onChange: (value: string | undefined) => void;
    disabled?: boolean;
    placeholder?: string;
}

export const AmountInput = ({
    value,
    onChange,
    placeholder,
    disabled
}: AmountInputProps) => {

    const parsedValue = parseFloat(value);
    const isIncome = parsedValue > 0;
    const isExpense = parsedValue < 0;

    const onReserveValue = () => {
        if (!value) return;

        const newValue = parseFloat(value) * -1;
        onChange(newValue.toString());
    };

    return (
        <div className='relative'>
            <TooltipProvider>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <Button
                            type='button'
                            onClick={onReserveValue}
                            className={cn(
                                'bg-slate-400 hover:bg-slate-500 absolute top-1 left-1 rounded-md p-2 flex items-center justify-center transition h-8',
                                isIncome && 'bg-emerald-500 hover:bg-emerald-600',
                                isExpense && 'bg-red-500 hover:bg-red-600'
                            )}
                        >
                            {!parsedValue && <Info className='size-4 text-white' />}
                            {isIncome && <PlusCircle className='size-4 text-white' />}
                            {isExpense && <MinusCircle className='size-4 text-white' />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Use [+] for income and [-]for expenses
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <CurrencyInput
                prefix='$'
                className='pl-10 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                placeholder={placeholder}
                value={value}
                decimalsLimit={2}
                decimalScale={2}
                onValueChange={onChange}
                disabled={disabled}
            />
            <p className='text-xs text-muted-foreground mt-1'>
                {isIncome && 'This will count as income'}
                {isExpense && 'This will count as an expense'}
            </p>
        </div>
    );
};
