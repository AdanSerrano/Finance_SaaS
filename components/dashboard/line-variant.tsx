import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

import { CustomTooltip } from '@/components/dashboard/custom-tooltip';
import React from 'react';
import { es } from 'date-fns/locale';
import { format } from "date-fns";

interface LineVariantProps {
    data?: {
        date: string,
        income: number,
        expenses: number
    }[];
}

export const LineVariant = ({ data }: LineVariantProps) => {
    const sortedData = data?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(item => ({
            ...item,
            expenses: Math.abs(item.expenses) // Convertir gastos a valores positivos
        }));
    return (
        <ResponsiveContainer width={'100%'} height={350}>
            <LineChart data={sortedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    axisLine={false}
                    tickLine={false}
                    dataKey="date"
                    tickFormatter={(value) => format(value, 'dd MMM', { locale: es })}
                    style={{ fontSize: '12px' }}
                    tickMargin={16}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                    dot={false}
                    dataKey={'income'}
                    stroke='#3d82f6'
                    strokeWidth={2}
                    className='drop-shadow-sm'
                />
                <Line
                    dot={false}
                    dataKey={'expenses'}
                    stroke='#f43f5e'
                    strokeWidth={2}
                    className='drop-shadow-sm'
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
