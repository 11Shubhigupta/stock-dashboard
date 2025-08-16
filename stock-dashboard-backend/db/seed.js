import fs from 'fs'
import path from 'path'
import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, 'stocks.db')
const schemaPath = path.join(__dirname, 'schema.sql')
const companiesPath = path.join(__dirname, '..', 'data', 'companies.json')

const sqlite = sqlite3.verbose()
const db = new sqlite.Database(dbPath)

const readSql = (p) => fs.readFileSync(p, 'utf8')

function randomWalkSeries(startPrice, days) {
  const arr = []
  let price = startPrice
  for (let i = 0; i < days; i++) {
    const drift = (Math.random() - 0.5) * 2 // -1..1
    const pct = drift * 0.02                 // ±2% daily
    const open = price
    let close = Math.max(5, open * (1 + pct))
    const high = Math.max(open, close) * (1 + Math.random() * 0.01)
    const low  = Math.min(open, close) * (1 - Math.random() * 0.01)
    const vol  = Math.floor(1_000_000 + Math.random() * 4_000_000)
    arr.push({ open, high, low, close, volume: vol })
    price = close
  }
  return arr
}

function isoDateNDaysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0,10)
}

async function run() {
  console.log('Seeding database...')
  const schema = readSql(schemaPath)
  const companies = JSON.parse(fs.readFileSync(companiesPath, 'utf8'))

  await exec(db, schema)

  await exec(db, 'DELETE FROM candles; DELETE FROM companies;')

  // Insert companies
  const insertCompany = db.prepare('INSERT INTO companies (symbol, name) VALUES (?, ?)')
  for (const c of companies) insertCompany.run(c.symbol, c.name)
  insertCompany.finalize()

  // Generate 400 days of data for each
  const insertCandle = db.prepare(
    'INSERT INTO candles (symbol, date, open, high, low, close, volume) VALUES (?, ?, ?, ?, ?, ?, ?)'
  )
  const startBase = {
    'AAPL': 180, 'MSFT': 380, 'GOOGL': 140, 'AMZN': 160, 'TSLA': 230, 'META': 480, 'NFLX': 620, 'NVDA': 1100,
    'TCS.NS': 3900, 'INFY.NS': 1600, 'HDFCBANK.NS': 1600, 'RELIANCE.NS': 3000
  }

  for (const c of companies) {
    const days = 400
    const ser = randomWalkSeries(startBase[c.symbol] ?? 100, days)
    for (let i = 0; i < days; i++) {
      const date = isoDateNDaysAgo(days - i)
      const row = ser[i]
      insertCandle.run(c.symbol, date, row.open, row.high, row.low, row.close, row.volume)
    }
  }
  insertCandle.finalize()

  console.log('Seed complete ✔')
  db.close()
}

function exec(db, sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => err ? reject(err) : resolve())
  })
}

run().catch(e => {
  console.error(e)
  process.exit(1)
})
