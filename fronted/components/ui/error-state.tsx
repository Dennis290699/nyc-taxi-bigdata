"use client"

import { AlertCircle, RefreshCcw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface ErrorStateProps {
    title: string
    description: string
    retryAction?: () => void
}

export function ErrorState({ title, description, retryAction }: ErrorStateProps) {
    return (
        <div className="flex h-[400px] items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
            >
                <Card className="relative overflow-hidden border-destructive/20 bg-card text-center shadow-lg">
                    {/* Decorative gradient bar - using destructive colors for error context */}
                    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-destructive via-orange-500 to-red-500" />

                    <CardContent className="space-y-6 pt-10 pb-8">
                        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-destructive" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold tracking-tight">{title}</h3>
                            <p className="text-muted-foreground text-sm max-w-[85%] mx-auto leading-relaxed">
                                {description}
                            </p>
                        </div>

                        {retryAction && (
                            <div className="pt-2">
                                <Button
                                    variant="outline"
                                    onClick={retryAction}
                                    className="gap-2 border-primary/20 hover:border-primary hover:bg-primary/5"
                                >
                                    <RefreshCcw className="w-4 h-4" />
                                    Retry Request
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
