import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';

import React from 'react'

interface RadarVariantProps {
    data?: {
        name: string;
        value: number;
    }[];
}

export const RadarVariant = ({ data }: RadarVariantProps) => {
    return (
        <ResponsiveContainer width={'100%'} height={350}>
            <RadarChart
                cx={'50%'}
                cy={'50%'}
                outerRadius={'60%'}
                data={data}
            >
                <PolarGrid />
                <PolarAngleAxis dataKey="name" style={{ fontSize: '12px' }} />
                <PolarRadiusAxis style={{ fontSize: '12px' }} />
                <Radar dataKey={'value'} stroke='#3b82f6' fill='#3b82f6' fillOpacity={0.6} />


            </RadarChart>
        </ResponsiveContainer>
    )
}
