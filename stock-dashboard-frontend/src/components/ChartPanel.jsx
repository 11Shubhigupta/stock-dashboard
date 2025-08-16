import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Tooltip, Legend, TimeSeriesScale
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, TimeSeriesScale)

export default function ChartPanel({ symbol, candles, overlays }) {
  const labels = useMemo(() => candles?.map(c => c.date) ?? [], [candles])
  const closeData = useMemo(() => candles?.map(c => c.close) ?? [], [candles])
  const volumeData = useMemo(() => candles?.map(c => c.volume) ?? [], [candles])
  const sma20 = useMemo(() => candles?.map(c => c.sma20 ?? null) ?? [], [candles])
  const sma50 = useMemo(() => candles?.map(c => c.sma50 ?? null) ?? [], [candles])
  const rsi14 = useMemo(() => candles?.map(c => c.rsi14 ?? null) ?? [], [candles])

  // Main price + volume chart
  const priceDatasets = [
    {
      label: `${symbol} Close`,
      data: closeData,
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.25,
      yAxisID: 'y'
    },
    overlays.showSMA20 && {
      label: 'SMA 20',
      data: sma20,
      borderWidth: 1.8,
      pointRadius: 0,
      tension: 0.25,
      borderDash: [6, 6],
      yAxisID: 'y'
    },
    overlays.showSMA50 && {
      label: 'SMA 50',
      data: sma50,
      borderWidth: 1.8,
      pointRadius: 0,
      tension: 0.25,
      borderDash: [2, 4],
      yAxisID: 'y'
    },
    overlays.showVolume && {
      type: 'bar',
      label: 'Volume',
      data: volumeData,
      yAxisID: 'y1',
      borderWidth: 0
    }
  ].filter(Boolean)

  const priceData = { labels, datasets: priceDatasets }

  const priceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#cfe6ff' } },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: {
        ticks: { color: '#9cc7ff' },
        grid: { color: 'rgba(100,150,255,0.08)' }
      },
      y: {
        position: 'left',
        ticks: { color: '#9cc7ff' },
        grid: { color: 'rgba(100,150,255,0.08)' }
      },
      y1: {
        position: 'right',
        ticks: { color: '#9cc7ff' },
        grid: { drawOnChartArea: false }
      }
    }
  }

  // RSI mini chart
  const rsiData = {
    labels,
    datasets: [
      overlays.showRSI && {
        label: 'RSI 14',
        data: rsi14,
        borderWidth: 1.6,
        pointRadius: 0,
        tension: 0.25
      }
    ].filter(Boolean)
  }

  const rsiOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#cfe6ff' } },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: {
        ticks: { color: '#9cc7ff' },
        grid: { color: 'rgba(100,150,255,0.06)' }
      },
      y: {
        min: 0, max: 100,
        ticks: { color: '#9cc7ff' },
        grid: { color: 'rgba(100,150,255,0.06)' }
      }
    }
  }

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>{symbol} — Price</h3>
      </div>
      <div className="chart-wrap" style={{ height: 360 }}>
        <Line data={priceData} options={priceOptions} />
      </div>

      <div className="chart-header" style={{ borderTop: '1px solid var(--border)' }}>
        <h3>RSI (14)</h3>
      </div>
      <div className="chart-wrap" style={{ height: 160, paddingTop: 4 }}>
        <Line data={rsiData} options={rsiOptions} />
        {/* RSI 30/70 guide bands */}
        <div className="rsi-bands">
          <div className="rsi-band" style={{ top: '30%' }} />
          <div className="rsi-band" style={{ top: '70%' }} />
        </div>
      </div>
    </div>
  )
}
