import React from 'react'
import CompanyItem from './CompanyItem.jsx'
import { motion } from 'framer-motion'

export default function Sidebar({ companies, active, onSelect }) {
  return (
    <motion.aside
      className="sidebar"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Companies</h2>
      <div className="company-list">
        {companies.map(c => (
          <CompanyItem
            key={c.symbol}
            company={c}
            active={active === c.symbol}
            onClick={() => onSelect(c.symbol)}
          />
        ))}
      </div>
    </motion.aside>
  )
}
