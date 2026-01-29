"use client"
import { motion } from "framer-motion"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { DailyStats } from "@/lib/types"
interface TripsChartProps {
  data: DailyStats[]
}
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
        <p className="font-semibold text-foreground">{label}</p>
        <div className="space-y-1">
          <p className="text-sm text-chart-1">
            Trips: {payload[0].value.toLocaleString()}
          </p>
          {payload[1] && (
            <p className="text-sm text-chart-2">
              Avg Fare: ${payload[1].value}
            </p>
          )}
        </div>
      </div>
    )
  }
  return null
}
export function TripsChart({ data, onClick }: TripsChartProps & { onClick?: (item: any) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Trip Trends</CardTitle>
          <CardDescription>Daily trip volume and average fare over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
                onClick={(data) => {
                  if (onClick && data && data.activePayload && data.activePayload[0]) {
                    onClick(data.activePayload[0].payload);
                  }
                }}
                className={onClick ? "cursor-pointer" : ""}
              >
                <defs>
                  <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorFare" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--muted-foreground)" }}
                  tickLine={{ stroke: "var(--border)" }}
                  axisLine={{ stroke: "var(--border)" }}
                  minTickGap={30}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "var(--muted-foreground)" }}
                  tickLine={{ stroke: "var(--border)" }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                    return value;
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "var(--muted-foreground)" }}
                  tickLine={{ stroke: "var(--border)" }}
                  axisLine={{ stroke: "var(--border)" }}
                  unit="$"
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border)", strokeWidth: 1 }} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="total_trips"
                  stroke="var(--chart-1)"
                  fillOpacity={1}
                  fill="url(#colorTrips)"
                  name="Total Trips"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="avg_fare"
                  stroke="var(--chart-2)"
                  fillOpacity={1}
                  fill="url(#colorFare)"
                  name="Average Fare"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
