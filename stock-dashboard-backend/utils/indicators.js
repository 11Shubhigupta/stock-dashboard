export function sma(values, period) {
  if (!values?.length || period <= 0) return []
  const out = []
  let sum = 0
  for (let i = 0; i < values.length; i++) {
    const v = values[i]
    sum += v
    if (i >= period) sum -= values[i - period]
    if (i >= period - 1) out.push(sum / period)
    else out.push(null)
  }
  return out
}

// Wilder's RSI(14)
export function rsi14(values, period = 14) {
  if (!values || values.length < period + 1) {
    return Array(values?.length || 0).fill(null)
  }
  const rsis = Array(values.length).fill(null)
  let gains = 0, losses = 0

  for (let i = 1; i <= period; i++) {
    const diff = values[i] - values[i - 1]
    if (diff >= 0) gains += diff
    else losses -= diff
  }
  let avgGain = gains / period
  let avgLoss = losses / period
  rsis[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + (avgGain / avgLoss))

  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1]
    const gain = diff > 0 ? diff : 0
    const loss = diff < 0 ? -diff : 0
    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
    rsis[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + (avgGain / avgLoss))
  }
  return rsis
}

export function highLow52(candles) {
  const last = candles.slice(-252)
  const highs = last.map(c => c.high)
  const lows = last.map(c => c.low)
  return { high52: Math.max(...highs), low52: Math.min(...lows) }
}

export function avgVolume(candles, lookback = 60) {
  const last = candles.slice(-lookback)
  const vols = last.map(c => c.volume)
  return vols.reduce((a,b)=>a+b,0) / Math.max(1, last.length)
}
