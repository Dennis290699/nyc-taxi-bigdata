"use client"

import { motion } from "framer-motion"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { TopZone } from "@/lib/types"

interface ZonesChartProps {
  data: TopZone[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
        <p className="font-semibold text-foreground">Zone {label}</p>
        <p className="text-sm text-chart-1">Pickups: {payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export function ZonesChart({ data }: ZonesChartProps) {
  const sortedData = [...data].sort((a, b) => b.pickup_count - a.pickup_count).slice(0, 15)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Top Pickup Zones</CardTitle>
          <CardDescription>Most popular taxi pickup locations by zone ID</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 30, bottom: 60 }}>
              <defs>
                <linearGradient id="colorZone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={1} />
                  <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
              <XAxis
                dataKey="ZoneID"
                angle={-45}
                textAnchor="end"
                tick={{ fill: "var(--muted-foreground)" }}
                stroke="var(--border)"
                height={80}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)" }}
                stroke="var(--border)"
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                  return value;
                }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.2 }} />
              <Bar dataKey="pickup_count" fill="url(#colorZone)" radius={[4, 4, 0, 0]} name="Pickups" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
