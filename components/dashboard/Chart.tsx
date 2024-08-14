import { AreaChart, BarChart3, FileSearch, LineChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { AreaVariant } from '@/components/dashboard/area-variant';
import { BarVariant } from '@/components/dashboard/bar-variant';
import { Line } from 'recharts';
import { LineVariant } from '@/components/dashboard/line-variant';
import React from 'react'
import { useState } from 'react'

interface ChartProps {
    data?: {
        date: string,
        income: number,
        expenses: number
    }[];
}


export const Chart = ({ data }: ChartProps) => {
    const [chartType, setChartType] = useState("area")

    const onTypeChange = (type: string) => {
        //TODO: add paywall
        setChartType(type)
    }
    return (
        <Card className='border-none drop-shadow-sm'>
            <CardHeader className='flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between'>
                <CardTitle className='text-xl line-clamp-1'>
                    Transactions
                </CardTitle>
                <Select
                    defaultValue={chartType}
                    onValueChange={onTypeChange}
                >
                    <SelectTrigger className='lg:w-auto h-9 rounded-md px-3'>
                        <SelectValue placeholder="Chart type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='area'>
                            <div className='flex items-center'>
                                <AreaChart className='size-4 mr-2 shrink-0' />
                                <p className='line-clamp-1'>Area chart</p>
                            </div>
                        </SelectItem>
                        <SelectItem value='bar'>
                            <div className='flex items-center'>
                                <BarChart3 className='size-4 mr-2 shrink-0' />
                                <p className='line-clamp-1'>Bar chart</p>
                            </div>
                        </SelectItem>
                        <SelectItem value='line'>
                            <div className='flex items-center'>
                                <LineChart className='size-4 mr-2 shrink-0' />
                                <p className='line-clamp-1'>Line chart</p>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                {data?.length === 0 ? (
                    <div className='flex flex-col gap-y-4 items-center justify-center h-[350px] w-full'>
                        <FileSearch className='size-6 text-muted-foreground' />
                        <p className='text-muted-foreground text-sm'>
                            No data for this period
                        </p>
                    </div>
                ) : (
                    <>
                        {chartType === 'area' && <AreaVariant data={data} />}
                        {chartType === 'bar' && <BarVariant data={data} />}
                        {chartType === 'line' && <LineVariant data={data} />}
                    </>
                )}
            </CardContent>
        </Card>
    )
}
