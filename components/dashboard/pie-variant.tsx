import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { CategoryTooltip } from "./categoy-tooltip";
import { formatPercentage } from "@/lib/utils";

const COLOR = ["#0062ff", "#12C6FF", "#FF647F", "#FF9354"]

interface PieVariantProps {
    data?: {
        name: string;
        value: number;
    }[];
}

export const PieVariant = ({ data }: PieVariantProps) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="right"
                    iconType="circle"
                    content={({ payload }) => {
                        return (
                            <ul className="flex flex-col space-y-2">
                                {payload?.map((entry: any, index: any) => (
                                    <li key={`item-${index}`} className="flex items-center space-x-2">
                                        <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                        <div className="space-x-1">
                                            <span className="text-sm text-muted-foreground">
                                                {entry.value}
                                            </span>
                                            <span className="text-sm ">
                                                {formatPercentage(entry.payload.percent * 100)}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )
                    }}
                />
                <Tooltip content={<CategoryTooltip />} />
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                >
                    {data?.map((_entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLOR[index % COLOR.length]}
                        />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};
