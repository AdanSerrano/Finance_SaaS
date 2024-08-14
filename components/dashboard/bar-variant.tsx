import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format, parseISO } from "date-fns";

import { CustomTooltip } from '@/components/dashboard/custom-tooltip';
import React from 'react';
import { es } from 'date-fns/locale';

interface BarVariantProps {
    data?: {
        date: string,
        income: number,
        expenses: number
    }[];
}

export const BarVariant: React.FC<BarVariantProps> = ({ data }) => {
    // Ordenar los datos por fecha y convertir gastos a positivos
    const sortedData = data?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(item => ({
            ...item,
            expenses: Math.abs(item.expenses) // Convertir gastos a valores positivos
        }));

    return (
        <ResponsiveContainer width={'100%'} height={350}>
            <BarChart data={sortedData} margin={{ left: 10, right: 10, top: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    axisLine={false}
                    tickLine={false}
                    dataKey="date"
                    tickFormatter={(value) => format(parseISO(value), 'dd MMM', { locale: es })}
                    style={{ fontSize: '12px' }}
                    tickMargin={16}
                    interval="preserveStartEnd"
                />
                <Tooltip
                    content={<CustomTooltip />}
                    formatter={(value, name) => [Number(value).toFixed(2), name === 'expenses' ? 'Gastos' : 'Ingresos']}
                />
                <Bar
                    dataKey="income"
                    fill="#3d82f6"
                    name="Ingresos"
                    className="drop-shadow-sm"
                />
                <Bar
                    dataKey="expenses"
                    fill="#f43f5e"
                    name="Gastos"
                    className="drop-shadow-sm"
                />
            </BarChart>
        </ResponsiveContainer>
    )
}