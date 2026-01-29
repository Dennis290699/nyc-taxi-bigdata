"use client"

import { motion } from "framer-motion"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { TipAnalysis } from "@/lib/types"

interface TipChartProps {
  data: TipAnalysis[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
        <p className="font-semibold text-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color || entry.fill }}>
            {entry.name}: {typeof entry.value === "number" ? entry.value.toFixed(2) : entry.value}
            {entry.name.includes("%") ? "%" : ""}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function TipChart({ data }: TipChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Tip Analysis by Distance</CardTitle>
          <CardDescription>Average tip amounts and percentages across distance ranges</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
              <XAxis
                dataKey="distance_bucket"
                angle={-20}
                textAnchor="end"
                tick={{ fill: "var(--muted-foreground)" }}
                stroke="var(--border)"
                height={80}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: "var(--muted-foreground)" }}
                stroke="var(--border)"
                label={{
                  value: "Avg Tip ($)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "var(--muted-foreground)",
                  offset: 10
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: "var(--muted-foreground)" }}
                stroke="var(--border)"
                label={{ value: "Tip %", angle: 90, position: "insideRight", fill: "var(--muted-foreground)" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: "var(--foreground)" }} />

              <Bar
                yAxisId="left"
                dataKey="avg_tip"
                fill="var(--chart-2)"
                radius={[8, 8, 0, 0]}
                name="Avg Tip ($)"
              />
              <Bar
                yAxisId="right"
                dataKey="tip_percentage"
                fill="var(--chart-5)"
                radius={[8, 8, 0, 0]}
                name="Tip %"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
