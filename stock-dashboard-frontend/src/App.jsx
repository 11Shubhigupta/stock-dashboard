import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import ChartPanel from './components/ChartPanel.jsx'
import MetricsBar from './components/MetricsBar.jsx'
import Loader from './components/Loader.jsx'
import IndicatorToggles from './components/IndicatorToggles.jsx'
import { getCompanies, getStockData, getPrediction } from './services/api.js'

const DEFAULT_RANGE = '3mo'
const DEFAULT_INTERVAL = '1d'

export default function App() {
  const [companies, setCompanies] = useState([])
  const [active, setActive] = useState(null)
  const [loading, setLoading] = useState(false)
  const [series, setSeries] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [range, setRange] = useState(DEFAULT_RANGE)
  const [interval, setInterval] = useState(DEFAULT_INTERVAL)

  // indicator toggles
  const [showSMA20, setShowSMA20] = useState(true)
  const [showSMA50, setShowSMA50] = useState(true)
  const [showRSI, setShowRSI] = useState(true)
  const [showVolume, setShowVolume] = useState(true)

  useEffect(() => {
    (async () => {
      const list = await getCompanies()
      setCompanies(list)
      setActive(list[0]?.symbol || null)
    })()
  }, [])

  useEffect(() => {
    if (!active) return
    setLoading(true)
    ;(async () => {
      const data = await getStockData(active, range, interval)
      // candles now include sma20/sma50/rsi14 series aligned per date
      setSeries(data.candles)
      setMetrics(data.metrics)
      const pred = await getPrediction(active)
      setPrediction(pred)
      setLoading(false)
    })()
  }, [active, range, interval])

  return (
    <div className="app">
      <Header />
      <div className="content">
        <Sidebar
          companies={companies}
          active={active}
          onSelect={setActive}
        />
        <motion.main
          className="main"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="toolbar">
            <div className="toolbar-group">
              <label>Range</label>
              <select value={range} onChange={(e)=>setRange(e.target.value)}>
                <option value="1mo">1M</option>
                <option value="3mo">3M</option>
                <option value="6mo">6M</option>
                <option value="1y">1Y</option>
                <option value="max">Max</option>
              </select>
            </div>
            <div className="toolbar-group">
              <label>Interval</label>
              <select value={interval} onChange={(e)=>setInterval(e.target.value)}>
                <option value="1d">1D</option>
              </select>
            </div>
          </div>

          <IndicatorToggles
            showSMA20={showSMA20} setShowSMA20={setShowSMA20}
            showSMA50={showSMA50} setShowSMA50={setShowSMA50}
            showRSI={showRSI} setShowRSI={setShowRSI}
            showVolume={showVolume} setShowVolume={setShowVolume}
          />

          {loading ? (
            <Loader />
          ) : (
            <>
              <MetricsBar metrics={metrics} prediction={prediction}/>
              <ChartPanel
                symbol={active}
                candles={series}
                overlays={{ showSMA20, showSMA50, showRSI, showVolume }}
              />
            </>
          )}
        </motion.main>
      </div>
    </div>
  )
}
