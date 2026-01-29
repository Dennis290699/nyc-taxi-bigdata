"use client"

import { motion } from "framer-motion"
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { DistanceDistribution } from "@/lib/types"

interface DistanceChartProps {
  data: DistanceDistribution[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
        <p className="font-semibold text-foreground">{label} miles</p>
        <p className="text-sm text-chart-3">Trips: {payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export function DistanceChart({ data }: DistanceChartProps) {
  const sortedData = [...data].sort((a, b) => a.miles - b.miles)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Distance Distribution</CardTitle>
          <CardDescription>Histogram of trip distances across all rides</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={450}>
            <ComposedChart data={sortedData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
              <defs>
                <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={1} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
              <XAxis
                dataKey="miles"
                label={{
                  value: "Distance (miles)",
                  position: "insideBottom",
                  offset: -10,
                  fill: "var(--muted-foreground)",
                }}
                tick={{ fill: "var(--muted-foreground)" }}
                stroke="var(--border)"
              />
              <YAxis
                label={{
                  value: "Trip Count",
                  angle: -90,
                  position: "insideLeft",
                  fill: "var(--muted-foreground)",
                  offset: 10
                }}
                tick={{ fill: "var(--muted-foreground)" }}
                stroke="var(--border)"
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                  return value;
                }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.2 }} />
              <Bar dataKey="count" fill="url(#colorDistance)" radius={[8, 8, 0, 0]} name="Trips" />
              <Line type="monotone" dataKey="count" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
