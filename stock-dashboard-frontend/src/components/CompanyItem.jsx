import React from 'react'
import { motion } from 'framer-motion'

export default function CompanyItem({ company, active, onClick }) {
  return (
    <motion.button
      className={`company-item ${active ? 'active' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="symbol">{company.symbol}</div>
      <div className="name">{company.name}</div>
    </motion.button>
  )
}
