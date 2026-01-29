"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/layout/header"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Server,
  Database,
  Layout,
  Code,
  GitBranch,
  Terminal,
  FileJson,
  Activity,
  MapPin,
  CreditCard,
  Truck
} from "lucide-react"

export default function DocsPage() {
  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "architecture", title: "Architecture" },
    { id: "api-reference", title: "API Reference" },
    { id: "data-dictionary", title: "Data Dictionary" },
  ]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="space-y-8 pb-20">
      <Header
        title="Documentation"
        description="Comprehensive guide to the NYC Taxi Analytics Platform architecture and API"
      />

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="flex-1 space-y-12 min-w-0">

          {/* Introduction */}
          <section id="introduction" className="space-y-4 scroll-mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4 flex items-center gap-2">
                <Terminal className="w-8 h-8 text-primary" />
                Introduction
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The NYC Taxi Big Data Analytics Platform is a high-performance system designed to process, analyze, and visualize millions of taxi trip records.
                Built on top of a robust Hadoop ecosystem, it provides real-time insights into urban mobility patterns, revenue metrics, and fleet efficiency.
              </p>
            </motion.div>
          </section>

          <Separator />

          {/* Architecture */}
          <section id="architecture" className="space-y-6 scroll-mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold tracking-tight mb-6 flex items-center gap-2">
                <Server className="w-8 h-8 text-primary" />
                System Architecture
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-500" />
                      Data Layer (Hadoop)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Distributed storage using <strong>HDFS</strong> for scalability.
                      Data is partitioned by year/month to optimize query performance for time-series analysis.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-yellow-500" />
                      Processing (Spark)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      <strong>Apache Spark</strong> jobs ingest raw Parquet files, clean data schemas, and pre-aggregate analytics into JSON-line formats for fast API consumption.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-green-500" />
                      API Layer (Express)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      A lightweight <strong>Node.js/Express</strong> server acts as the gateway. It caches HDFS reads and serves structured JSON responses to the frontend.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layout className="w-5 h-5 text-purple-500" />
                      Frontend (Next.js)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      built with <strong>Next.js 14</strong>, Tailwind CSS, and Recharts. Focuses on responsive visualization and interactive dashboards.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </section>

          <Separator />

          {/* API Reference */}
          <section id="api-reference" className="space-y-6 scroll-mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold tracking-tight mb-6 flex items-center gap-2">
                <Activity className="w-8 h-8 text-primary" />
                API Reference
              </h2>
              <p className="text-muted-foreground mb-6">
                All API endpoints are prefixed with <code className="bg-muted px-1 py-0.5 rounded text-sm">/api/v1</code> and return JSON responses.
              </p>

              <div className="space-y-4">
                <EndpointCard
                  method="GET"
                  path="/dashboard/system-stats"
                  description="Detailed system health, storage usage, and high-level business metrics summary."
                />
                <EndpointCard
                  method="GET"
                  path="/dashboard/trips-over-time"
                  description="Daily aggregation of total trips and average fares."
                />
                <EndpointCard
                  method="GET"
                  path="/dashboard/top-zones"
                  description="Top 5 pickup and dropoff zones by volume."
                />
                <EndpointCard
                  method="GET"
                  path="/dashboard/payment-stats"
                  description="Breakdown of trip payments by type (Credit Card, Cash, etc.)."
                />
              </div>
            </motion.div>
          </section>

          <Separator />

          {/* Data Dictionary */}
          <section id="data-dictionary" className="space-y-6 scroll-mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold tracking-tight mb-6 flex items-center gap-2">
                <FileJson className="w-8 h-8 text-primary" />
                Data Dictionary
              </h2>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <MetricCard
                  icon={Truck}
                  name="Total Trips"
                  desc="Valid taxi rides completed within the dataset timeframe."
                />
                <MetricCard
                  icon={CreditCard}
                  name="Avg Fare"
                  desc="Mean transaction value excluding tolls and tips."
                />
                <MetricCard
                  icon={MapPin}
                  name="Zone ID"
                  desc="Unique identifier for NYC taxi zones (PULocationID/DOLocationID)."
                />
              </div>
            </motion.div>
          </section>

        </div>

        {/* Sticky Sidebar Navigation */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 space-y-4">
            <h4 className="font-semibold text-sm tracking-widest text-muted-foreground uppercase mb-4">
              On this page
            </h4>
            <nav className="flex flex-col space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="text-sm text-left text-muted-foreground hover:text-foreground transition-colors py-1 pl-4 border-l-2 border-transparent hover:border-primary"
                >
                  {section.title}
                </button>
              ))}
            </nav>

            <Card className="mt-8 bg-muted/50 border-none">
              <CardContent className="p-4 space-y-2">
                <p className="text-xs font-semibold">Need help?</p>
                <p className="text-xs text-muted-foreground">
                  Check the <span className="text-primary cursor-pointer hover:underline">GitHub repository</span> for the latest issue tracker.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  )
}

function EndpointCard({ method, path, description }: { method: string, path: string, description: string }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-4 bg-muted/30 p-4 border-b">
        <Badge variant={method === 'GET' ? 'default' : 'secondary'} className="uppercase">
          {method}
        </Badge>
        <code className="text-sm font-mono font-semibold">{path}</code>
      </div>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function MetricCard({ name, desc, icon: Icon }: { name: string, desc: string, icon: any }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold text-sm">{name}</h4>
          <p className="text-xs text-muted-foreground mt-1">{desc}</p>
        </div>
      </CardContent>
    </Card>
  )
}
