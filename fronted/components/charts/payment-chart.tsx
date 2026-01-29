"use client"

import { motion } from "framer-motion"
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { PaymentStat } from "@/lib/types"

interface PaymentChartProps {
  data: PaymentStat[]
}

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
        <p className="font-semibold text-foreground">{payload[0].name}</p>
        <p className="text-sm text-muted-foreground">
          Count: {payload[0].value.toLocaleString()} ({payload[0].payload.percentage}%)
        </p>
      </div>
    )
  }
  return null
}

export function PaymentChart({ data }: PaymentChartProps) {
  const total = data.reduce((sum, item) => sum + item.total_count, 0)

  const chartData = data.map((item, index) => ({
    name: item.payment_desc,
    value: item.total_count,
    percentage: ((item.total_count / total) * 100).toFixed(1),
    color: COLORS[index % COLORS.length],
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Payment Method Distribution</CardTitle>
          <CardDescription>Breakdown of payment types used</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="var(--card)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-col justify-center space-y-3">
              {chartData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{item.value.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
