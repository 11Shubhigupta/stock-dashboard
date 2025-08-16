import React from 'react'
import { motion } from 'framer-motion'

export default function Header() {
  return (
    <motion.header
      className="header"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="brand">
        <div className="logo-pulse" />
        <h1>Stock<span className="accent">Vision</span></h1>
      </div>
      <p className="tagline">Track • Analyze • Predict</p>
    </motion.header>
  )
}
