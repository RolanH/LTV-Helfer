"use client"

import { motion } from "framer-motion"

interface AnimatedCardProps {
  children: React.ReactNode
}

export default function AnimatedCard({ children }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
    >
      {children}
    </motion.div>
  )
} 