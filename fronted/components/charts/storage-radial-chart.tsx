"use client"

import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { HardDrive } from "lucide-react"

export interface StorageRadialChartProps {
    percentUsed: string
    usedBytes: string
    totalBytes: string
}

const chartConfig = {
    used: {
        label: "Used",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function StorageRadialChart({ percentUsed, usedBytes, totalBytes }: StorageRadialChartProps) {
    const data = [
        {
            name: "usage",
            value: parseFloat(percentUsed),
            fill: "var(--color-used)",
        },
    ]

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    Storage Capacity
                </CardTitle>
                <CardDescription>HDFS Cluster Allocation</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[200px]"
                >
                    <RadialBarChart
                        data={data}
                        startAngle={90}
                        endAngle={450} // Full circle clockwise starting from top
                        innerRadius={65}
                        outerRadius={90}
                    >
                        <RadialBar
                            dataKey="value"
                            background={{ fill: "var(--muted)" }} // Use muted color for the track/total space
                            cornerRadius={10}
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-[var(--chart-1)] text-3xl font-bold"
                                                >
                                                    {percentUsed}%
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 20}
                                                    className="fill-muted-foreground text-xs"
                                                >
                                                    Used
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <div className="flex items-center justify-center p-4 pt-0">
                <div className="flex w-full justify-between text-xs text-muted-foreground px-4">
                    <div className="flex flex-col items-center">
                        <span className="font-medium text-foreground">{usedBytes}</span>
                        <span>Used</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-medium text-foreground">{totalBytes}</span>
                        <span>Total</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}
