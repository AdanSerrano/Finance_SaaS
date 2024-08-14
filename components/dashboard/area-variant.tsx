import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { CustomTooltip } from '@/components/dashboard/custom-tooltip';
import React from 'react';
import { es } from 'date-fns/locale';
import { format } from "date-fns";

interface AreaVariantProps {
    data?: {
        date: string,
        income: number,
        expenses: number
    }[];
}

export const AreaVariant: React.FC<AreaVariantProps> = ({ data }) => {
    const sortedData = data?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(item => ({
            ...item,
            expenses: Math.abs(item.expenses) // Convertir gastos a valores positivos
        }));

    return (
        <ResponsiveContainer width={'100%'} height={350}>
            <AreaChart data={sortedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <defs>
                    <linearGradient id='income' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='2%' stopColor='#3d82f6' stopOpacity={0.8} />
                        <stop offset='98%' stopColor='#3d82f6' stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id='expenses' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='2%' stopColor='#f43f5e' stopOpacity={0.8} />
                        <stop offset='98%' stopColor='#f43f5e' stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis
                    axisLine={false}
                    tickLine={false}
                    dataKey='date'
                    tickFormatter={(value) => format(value, 'dd MMM', { locale: es })}
                    style={{
                        fontSize: '12px',
                    }}
                    tickMargin={16}
                />
                {/* <YAxis axisLine={false} tickLine={false} /> */}
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey="income"
                    stackId={'income'}
                    strokeWidth={2}
                    stroke="#3d82f6"
                    fill="url(#income)"
                    className='drop-shadow-sm'
                />
                <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId={'expenses'}
                    strokeWidth={2}
                    stroke="#f43f5e"
                    fill="url(#expenses)"
                    className='drop-shadow-sm'
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};