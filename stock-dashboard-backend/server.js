import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'
import { sma, highLow52, avgVolume, rsi14 } from './utils/indicators.js'
import { linearRegressionYNext } from './utils/regression.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, 'db', 'stocks.db')
const sqlite = sqlite3.verbose()
const db = new sqlite.Database(dbPath)

const runQuery = (sql, params=[]) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows))
})

app.get('/api/companies', async (req, res) => {
  try {
    const rows = await runQuery('SELECT symbol, name FROM companies ORDER BY symbol ASC')
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/stocks/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params
    const { range='3mo', interval='1d' } = req.query

    const daysMap = { '1mo': 30, '3mo': 90, '6mo': 180, '1y': 365, 'max': 10000 }
    const days = daysMap[range] ?? 90
    const startISO = isoDateNDaysAgo(days)

    // limited view (for chart window)
    const rows = await runQuery(
      `SELECT date, open, high, low, close, volume
       FROM candles
       WHERE symbol = ? AND date >= ?
       ORDER BY date ASC`,
       [symbol, startISO]
    )
    // full history for metrics & RSI smoothing
    const fullRows = await runQuery(
      `SELECT date, open, high, low, close, volume
       FROM candles
       WHERE symbol = ?
       ORDER BY date ASC`,
       [symbol]
    )

    const history = fullRows.map(r => ({ date: r.date, open:+r.open, high:+r.high, low:+r.low, close:+r.close, volume:+r.volume }))
    const closesFull = history.map(c => c.close)

    // Build indicators on full history, then slice to window range
    const sma20Full = sma(closesFull, 20)
    const sma50Full = sma(closesFull, 50)
    const rsi14Full = rsi14(closesFull, 14)

    // map limited candles and attach indicators aligned by date
    const windowSet = new Set(rows.map(r => r.date))
    const byDate = {}
    history.forEach((h, idx) => {
      byDate[h.date] = {
        sma20: sma20Full[idx],
        sma50: sma50Full[idx],
        rsi14: rsi14Full[idx]
      }
    })

    const candles = rows.map(r => ({
      date: r.date,
      open: +r.open, high: +r.high, low: +r.low, close: +r.close, volume: +r.volume,
      sma20: byDate[r.date]?.sma20 ?? null,
      sma50: byDate[r.date]?.sma50 ?? null,
      rsi14: byDate[r.date]?.rsi14 ?? null
    }))

    const { high52, low52 } = highLow52(history)
    const avgVol = avgVolume(history, 60)
    const closesWnd = candles.map(c => c.close)
    const sma20Last = lastDefined(sma20Full)
    const sma50Last = lastDefined(sma50Full)

    res.json({
      symbol, range, interval,
      candles,
      metrics: { high52, low52, avgVolume: Math.round(avgVol), sma20: sma20Last, sma50: sma50Last }
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/predict/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params
    const rows = await runQuery(
      `SELECT close FROM candles WHERE symbol = ? ORDER BY date ASC`,
      [symbol]
    )
    const closes = rows.map(r => +r.close)
    const window = closes.slice(-120)
    const predictedClose = linearRegressionYNext(window)
    res.json({ symbol, predictedClose })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

function isoDateNDaysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0,10)
}
function lastDefined(arr) {
  for (let i = arr.length - 1; i >= 0; i--) if (arr[i] != null) return arr[i]
  return null
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
