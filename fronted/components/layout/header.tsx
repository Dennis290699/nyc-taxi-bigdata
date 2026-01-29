"use client"

import { motion } from "framer-motion"
import { Activity } from "lucide-react"

interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 flex items-start justify-between"
    >
      <div className="space-y-1">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">{title}</h1>
        {description && <p className="text-pretty text-muted-foreground lg:text-lg">{description}</p>}
      </div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"
      >
        <Activity className="h-6 w-6 text-primary" />
      </motion.div>
    </motion.div>
  )
}
