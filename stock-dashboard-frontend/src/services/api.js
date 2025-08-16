import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export async function getCompanies() {
  const { data } = await axios.get(`${API_BASE}/api/companies`)
  return data
}

export async function getStockData(symbol, range='3mo', interval='1d') {
  const { data } = await axios.get(`${API_BASE}/api/stocks/${symbol}`, {
    params: { range, interval }
  })
  return data
}

export async function getPrediction(symbol) {
  const { data } = await axios.get(`${API_BASE}/api/predict/${symbol}`)
  return data
}
