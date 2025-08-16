import React from 'react'
import { motion } from 'framer-motion'

export default function MetricsBar({ metrics, prediction }) {
  if (!metrics) return null
  const card = (label, value) => (
    <motion.div className="metric" whileHover={{ y: -2 }}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
    </motion.div>
  )
  return (
    <div className="metrics">
      {card('52W High', metrics.high52?.toFixed(2))}
      {card('52W Low', metrics.low52?.toFixed(2))}
      {card('Avg Volume', metrics.avgVolume?.toLocaleString())}
      {card('SMA 20', metrics.sma20?.toFixed(2))}
      {card('SMA 50', metrics.sma50?.toFixed(2))}
      {card('Next-Day (AI)', prediction?.predictedClose?.toFixed(2))}
    </div>
  )
}
